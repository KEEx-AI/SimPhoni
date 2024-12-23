import os
import fnmatch
import tkinter as tk
from tkinter import filedialog, messagebox, ttk, IntVar

def parse_gitignore(gitignore_path):
    patterns = []
    if os.path.exists(gitignore_path):
        with open(gitignore_path, 'r', encoding='utf-8', errors='ignore') as f:
            for line in f:
                line=line.strip()
                if not line or line.startswith('#'):
                    continue
                patterns.append(line)
    return patterns

def is_ignored(path, repo_root, ignore_patterns):
    rel_path = os.path.relpath(path, repo_root)
    for pat in ignore_patterns:
        if pat.startswith('/'):
            pat = pat[1:]
            if fnmatch.fnmatch(rel_path, pat):
                return True
        else:
            if fnmatch.fnmatch(rel_path, pat):
                return True
    return False

def is_binary_file(filename):
    bin_ext = [
        '.png','.jpg','.jpeg','.gif','.ico','.exe','.dll','.so','.pdf',
        '.zip','.tar','.gz','.mp4','.mp3','.doc','.docx','.xls','.xlsx',
        '.ppt','.pptx','.woff','.woff2','.ttf','.otf','.pack','.psd','.ai',
        '.mov','.avi','.flv','.mkv'
    ]
    ext = os.path.splitext(filename)[1].lower()
    return ext in bin_ext

def get_default_excluded_dirs():
    return ['.git', '.svn', '.hg', 'node_modules', 'dist', 'build', 'vendor']

def choose_repo():
    repo_dir = filedialog.askdirectory(title="Select your Repo Directory")
    if not repo_dir:
        return
    
    gitignore_path = os.path.join(repo_dir, '.gitignore')
    ignore_patterns = parse_gitignore(gitignore_path)

    excluded_dirs = get_default_excluded_dirs()
    file_list = []

    max_file_size = 1 * 1024 * 1024  # 1MB size limit

    # Rename variables to avoid overshadowing `root`
    for walk_root, walk_dirs, walk_files in os.walk(repo_dir):
        walk_dirs[:] = [d for d in walk_dirs if d not in excluded_dirs and
                        not is_ignored(os.path.join(walk_root, d), repo_dir, ignore_patterns)]
        
        for f in walk_files:
            full_path = os.path.join(walk_root, f)
            if is_ignored(full_path, repo_dir, ignore_patterns):
                continue
            if not os.path.exists(full_path):
                continue

            size = os.path.getsize(full_path)
            include = True
            if size > max_file_size:
                include = False
            if is_binary_file(f):
                include = False
            
            rel_path = os.path.relpath(full_path, repo_dir)
            file_list.append((rel_path, include))

    ConfirmWindow(root, repo_dir, file_list)

class ConfirmWindow(tk.Toplevel):
    def __init__(self, parent, repo_dir, file_list):
        super().__init__(parent)
        self.title("Select Files to Include")
        self.geometry("500x400")
        self.repo_dir = repo_dir

        lbl = tk.Label(self, text="Select which files to include in Combined_Repo.txt:")
        lbl.pack(pady=5)

        frame = tk.Frame(self)
        frame.pack(expand=True, fill=tk.BOTH)

        canvas = tk.Canvas(frame)
        scrollbar = ttk.Scrollbar(frame, orient="vertical", command=canvas.yview)
        scroll_frame = tk.Frame(canvas)

        scroll_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )

        canvas.create_window((0,0), window=scroll_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)

        canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")

        self.file_vars = []
        for (path, default_include) in file_list:
            var = IntVar(value=1 if default_include else 0)
            cb = tk.Checkbutton(scroll_frame, text=path, variable=var, anchor='w', justify='left')
            cb.pack(fill='x', padx=5, pady=2)
            self.file_vars.append((path, var))

        btn_frame = tk.Frame(self)
        btn_frame.pack(pady=10)
        
        select_all_btn = tk.Button(btn_frame, text="Select All", command=self.select_all)
        deselect_all_btn = tk.Button(btn_frame, text="Deselect All", command=self.deselect_all)
        generate_btn = tk.Button(btn_frame, text="Generate Combined_Repo.txt", command=self.generate_combined)

        select_all_btn.grid(row=0, column=0, padx=5)
        deselect_all_btn.grid(row=0, column=1, padx=5)
        generate_btn.grid(row=0, column=2, padx=5)

    def select_all(self):
        for _, var in self.file_vars:
            var.set(1)

    def deselect_all(self):
        for _, var in self.file_vars:
            var.set(0)

    def generate_combined(self):
        chosen_files = [path for (path, var) in self.file_vars if var.get() == 1]

        output_path = os.path.join(self.repo_dir, "Combined_Repo.txt")
        with open(output_path, 'w', encoding='utf-8', errors='ignore') as out:
            out.write("This file is a merged representation of selected repository files.\n\n")
            for rel_path in chosen_files:
                full_path = os.path.join(self.repo_dir, rel_path)
                
                out.write("==============\n")
                out.write(f"File: {rel_path}\n")
                out.write("==============\n")

                if is_binary_file(os.path.basename(rel_path)):
                    out.write("[Skipped binary content]\n\n")
                else:
                    try:
                        with open(full_path, 'r', encoding='utf-8', errors='ignore') as infile:
                            content = infile.read()
                        out.write(content)
                        out.write("\n\n")
                    except:
                        out.write("[Could not read this file]\n\n")

        messagebox.showinfo("Done", f"Combined repo file created at:\n{output_path}")
        self.destroy()

root = tk.Tk()
root.title("Repo-to-Text")
root.geometry("300x150")

frame = tk.Frame(root)
frame.pack(expand=True, fill=tk.BOTH)

label = tk.Label(frame, text="Combine your repo into a single .txt file:")
label.pack(pady=20)

btn = tk.Button(frame, text="Choose Repo", command=choose_repo)
btn.pack()

root.mainloop()
