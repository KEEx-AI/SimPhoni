export const defaultSchema = {
  "personaArray": {
    "arrayName": "TeamWizardSolvesClimateChange",
    "personas": [
      {
        "nickname": "One",
        "model": "llama3.2:1b",
        "creativity": 8,
        "definePersona": "You're a project manager who specializes in coordinating teams to solve large-scale problems."
      },
      {
        "nickname": "Two",
        "model": "llama3.2:1b",
        "creativity": 2,
        "definePersona": "You're an engineer who can build any tool needed to tackle climate issues."
      },
      {
        "nickname": "Three",
        "model": "llama3.2:1b",
        "creativity": 6,
        "definePersona": "You're a scientist with deep knowledge of climate systems and ecology."
      },
      {
        "nickname": "Four",
        "model": "llama3.2:3b",
        "creativity": 9,
        "definePersona": "You're a wizard who can magically influence climate factors."
      },
      {
        "nickname": "Five",
        "model": "llama3.2:3b",
        "creativity": 9,
        "definePersona": "You're a policy maker adept at crafting international agreements."
      },
      {
        "nickname": "Six",
        "model": "llama3.2:1b",
        "creativity": 9,
        "definePersona": "You're a teacher who can communicate complex topics to the public."
      },
      {
        "nickname": "Seven",
        "model": "llama3.2:3b",
        "creativity": 9,
        "definePersona": "You're an artist who can inspire change through creative expression."
      },
      {
        "nickname": "Eight",
        "model": "llama3.2:3b",
        "creativity": 4,
        "definePersona": "You're a hero who bravely implements on-the-ground solutions."
      },
      {
        "nickname": "Nine",
        "model": "llama3.2:3b",
        "creativity": 5,
        "definePersona": "You're a member of an advisory council guiding policy decisions."
      }
    ]
  },
  "instructLines": [
    {
      "type": "instruct",
      "persona": "One",
      "instructText": "Make a plan to solve climate change"
    },
    {
      "type": "instruct",
      "persona": "Two",
      "instructText": "Criticize One's plan to solve climate change"
    },
    {
      "type": "loop",
      "iterations": 2,
      "mode": "count",
      "instructLines": [
        {
          "type": "instruct",
          "persona": "Five",
          "instructText": "Use Two's critiques to improve One's plan to solve climate change."
        },
        {
          "type": "instruct",
          "persona": "Three",
          "instructText": "Search the web for current information to refine Five's improved plan."
        }
      ]
    },
    {
      "type": "loop",
      "iterations": 1,
      "mode": "count",
      "instructLines": [
        {
          "type": "instruct",
          "persona": "Six",
          "instructText": "Combine all available context into a formal project proposal addressing the climate crisis."
        }
      ]
    },
    {
      "type": "instruct",
      "persona": "Four",
      "instructText": "If we ever actually make it to the end of this, let's celebrate!!!"
    }
  ]
};
