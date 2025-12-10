# Code Walkthrough Script Generator - Prompt Template

Use this prompt to generate a professional code walkthrough script for any project.

---

## PROMPT TO USE:

I need you to create a comprehensive code walkthrough script for my project. This script will be used to record a video presentation for my professor. Please analyze the provided files and generate a detailed, conversational script following the structure and requirements below.

### PROJECT INFORMATION

**Project Name:** [Your project name]

**Project Description:** [Brief description of what the project does - 2-3 sentences]

**Technology Stack:** [e.g., React + TypeScript + Zustand, Vue + Pinia, etc.]

**Files to Cover:** [List the 3-5 most important code files with their paths]
1. `path/to/file1.ts` - [Brief description: e.g., "State management"]
2. `path/to/file2.tsx` - [Brief description: e.g., "Main component"]
3. `path/to/file3.ts` - [Brief description: e.g., "Data layer"]

### SCRIPT STRUCTURE REQUIREMENTS

Please generate a script with the following sections:

#### 1. Introduction (Opening)
- Brief project introduction (2-3 sentences)
- What the user will learn
- Overview of files to be covered

#### 2. Non-Technical Overview: How the Application Works
**Requirements:**
- Explain the application using everyday analogies (like "digital scrapbook", "photo album", etc.)
- Break down the architecture into 2-4 main conceptual pieces
- Use analogies that non-programmers can understand
- Explain how the pieces work together
- Show the data flow with a simple diagram in text (e.g., Data → Logic → UI → User)
- Keep it concise (2-3 minutes of speaking time)

**Format:**
- Use headers like "First, the [Name]", "Second, the [Name]"
- Include relatable metaphors
- End with transition: "Alright, now let's look at the actual code..."

#### 3. Detailed Code Walkthrough (For Each File)

For each file, break down into sections by line numbers:

**Format:**
```
## Part [N]: [File Purpose] - `filename.ext`

### Lines X-Y: [Section Name]

[Code snippet if relevant]

[Explanation in first person, conversational style]
```

**Explanation Requirements:**
- **First-person perspective:** Use "I", "I think", "I chose", "Let me explain"
- **Conversational tone:** "you know?", "So basically", "Okay, so", "And then"
- **Natural flow:** Use connecting words like "So", "Now", "And then", "Finally"
- **Technical depth:** Explain WHY decisions were made, not just WHAT the code does
- **Specify line numbers:** Always reference specific line numbers when discussing code
- **Highlight React concepts:** Point out hooks, patterns, state management, etc.
- **Code reasoning:** Explain the thought process behind implementation choices

**For each code section, address:**
- What this code does
- Why I chose this approach
- How it connects to other parts
- Any React patterns or best practices used
- Performance considerations (if applicable)

#### 4. Troubleshooting & Reflection

**Requirements:**
- Describe 3-4 major challenges faced during development
- For each challenge, include:
  - **Problem description** (what went wrong)
  - **Solutions attempted** (what I tried)
  - **Final solution** (what worked)
  - **What I learned** (reflection)
- Include 2-3 unresolved issues or future improvements
- End with overall reflection on the learning experience

**Tone:**
- Honest and reflective
- Use phrases like "I was like...", "At first I thought...", "Then I realized..."
- Show problem-solving process
- Demonstrate growth mindset

#### 5. Conclusion

**Requirements:**
- Recap the main files covered
- Highlight key React concepts demonstrated
- Express what you're most proud of
- Thank the audience

### WRITING STYLE REQUIREMENTS

**Voice and Tone:**
- ✅ First person: "I think", "I chose", "I learned"
- ✅ Conversational: "you know?", "like", "So basically"
- ✅ Natural connectors: "So", "And then", "Okay", "Finally", "Now"
- ✅ Casual but professional: "that's pretty cool", "which is really neat"
- ❌ No overly formal language
- ❌ No robotic explanations

**Technical Communication:**
- Explain complex concepts in simple terms first
- Use analogies where helpful
- Always explain the "why" behind decisions
- Connect code to real-world behavior users see
- Point out React patterns and best practices

**Video-Friendly Format:**
- Clear section headers for easy navigation
- Line number references for pointing during recording
- Natural pause points between sections
- Smooth transitions between topics

### OUTPUT FORMAT

Please generate a complete markdown file with:
- Clear section headers (##)
- Subsection headers for line ranges (###)
- Code snippets in markdown code blocks when helpful
- Natural, conversational explanations
- Smooth transitions between sections

### EXAMPLE OPENING STYLE

"Hi everyone! Today I'm going to walk you through the core code of my [Project Name] project. This is [brief description]. So basically, the idea is that [main concept].

I'm going to focus on [number] main files that really showcase what I learned in [technology] - they're the heart of the application. Let me show you how everything works together."

### EXAMPLE EXPLANATION STYLE

"Okay, so let me start with the simplest file first - this is where all my [content/data/logic] lives. On line X, I'm [doing something]. I chose to use [technology/pattern] because it really helps with [benefit], you know? Like, if I accidentally [potential problem], [technology] will [solution].

So here on lines X to Y, I'm [implementing feature]. I think of this as [analogy]. The cool thing here is that I'm using [pattern], which is a really common pattern in [framework]..."

---

## USAGE INSTRUCTIONS

1. Replace all `[bracketed]` sections with your project-specific information
2. Provide the actual file paths or file contents to Claude
3. Copy and paste this entire prompt
4. Claude will generate a complete walkthrough script

---

## ADDITIONAL CONTEXT TO PROVIDE (Optional but Helpful)

If you have any of the following, include them:
- Project README
- Key challenges you remember facing
- Specific concepts you want to highlight
- Time constraints (if the script needs to fit a specific duration)
- Any specific professor requirements or rubric criteria

---

## EXAMPLE USAGE

```
[Copy the PROMPT TO USE section above]

PROJECT INFORMATION:
Project Name: Task Manager Pro
Project Description: A collaborative task management application with real-time updates and drag-and-drop functionality.
Technology Stack: React + TypeScript + Firebase + React Query
Files to Cover:
1. src/hooks/useTasks.ts - Custom hook for task management
2. src/components/TaskBoard.tsx - Main board component with drag-and-drop
3. src/services/firebase.ts - Firebase integration and real-time sync

[Attach or paste the file contents here]
```

---

## TIPS FOR BEST RESULTS

1. **Be specific about your project's purpose** - The clearer the description, the better the analogies
2. **Prioritize your most interesting files** - Choose files that best demonstrate your React skills
3. **Mention specific challenges** - If you remember specific bugs or issues, include them
4. **Indicate time frame** - If you need a 5-minute or 10-minute script, mention it
5. **Highlight learning goals** - Mention specific React concepts you want to showcase

---

## QUALITY CHECKLIST

Your generated script should have:
- [ ] Clear introduction with project overview
- [ ] Non-technical overview with relatable analogies
- [ ] Line-by-line code explanations with specific line numbers
- [ ] First-person, conversational tone throughout
- [ ] 3-4 troubleshooting challenges with solutions
- [ ] Unresolved issues and future improvements
- [ ] Thoughtful reflection on learning experience
- [ ] Natural transitions between sections
- [ ] Appropriate length for video recording (typically 10-15 minutes of content)

---

## NOTES

- The script should be ready to read aloud while recording
- Include natural pauses and transitions
- Make it personal - this is YOUR learning journey
- Be honest about challenges - professors appreciate authenticity
- Show growth mindset and problem-solving skills
