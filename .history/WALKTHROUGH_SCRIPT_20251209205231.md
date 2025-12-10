# World GDP Visualization - Code Walkthrough Script

## Part 1: Introduction

Hi everyone! Today I'm going to walk you through the core code of my **World GDP Trends** visualization project. This is an interactive data visualization that shows GDP trends from 10 major economies over 10 years, using Chart.js with custom effects and interactive features.

I'm going to focus on two main files:
1. **`main.js`** - The Chart.js implementation with all visual effects and interactivity
2. **`data.js`** - The dataset structure

Let me show you how everything works together.

---

## Part 2: Non-Technical Overview

Before diving into the code, let me explain how this application works using everyday concepts.

### First, the Data Layer

Think of this like a spreadsheet. I have 10 countries and 10 years of GDP data — that's 100 numbers total. Each country also has an assigned color, like giving each student a different colored marker.

### Second, the Visualization Engine

Chart.js is like a smart artist. I give it numbers, and it draws beautiful charts. But I've customized this artist with special instructions:
- "Make the lines glow with gradient colors"
- "Color rising parts green and falling parts red"
- "Draw each line one after another, not all at once"

### Third, the Interactive Controls

The buttons and chips are like a remote control for the chart. Users can:
- Select which countries to show (like changing TV channels)
- Turn on Compare Mode (like switching from "actual temperature" to "temperature change")
- Press Play to watch the data animate year by year (like a time-lapse video)

### How They Work Together

```
Data (numbers) → Chart.js (draws) → Effects (makes it pretty) → User (interacts)
```

Alright, now let's look at the actual code...

---

## Part 3: Detailed Code Walkthrough

---

### File 1: `data.js`

#### Lines 1-14: GDP Dataset

This is where all my data lives. I have a `labels` array with years 2015 to 2024, and a `countries` object where each country has an array of GDP values in trillion USD. So basically, 10 countries times 10 years gives me 100 data points, which meets the assignment requirement of at least 20 rows.

#### Lines 16-27: Color Configuration

Each country gets a unique color. I chose these from a standard data visualization palette. The cool thing is I reuse these colors everywhere — in the chart lines, the gradient fills, and the country selector chips. This keeps everything consistent.

---

### File 2: `main.js`

This is where all the Chart.js magic happens.

#### Lines 1-6: State Variables

I'm tracking several states here. The `chart` variable holds the Chart.js instance so I can destroy and recreate it when data changes. Then I have `compareMode` for toggling between absolute GDP and percentage growth, `baseYear` for the comparison reference point, and the playback states for the timeline animation feature.

#### Lines 13-18: Gradient Fill Effect

Okay, so this is one of my favorite visual effects. I'm using Canvas's `createLinearGradient` to create a vertical gradient. It starts at 60% opacity at the top, fades to 20% in the middle, and becomes fully transparent at the bottom. This gives each line a nice "glow" effect underneath, which makes the chart look much more polished than just solid fills.

#### Lines 21-35: Compare Mode Data Transformation

When compare mode is ON, this function transforms the raw GDP values into percentage change from the base year. So if I set base year to 2015 and USA's GDP was 18.2 trillion then and 28.8 trillion in 2024, it calculates that as about +58% growth. This lets users compare countries fairly — like, India might have smaller GDP than USA, but its growth rate is actually faster.

#### Lines 37-69: Dataset Configuration

This is where I configure each line on the chart. Lines 42-46 set up the basic styling — border color, background gradient, smooth curves with `tension: 0.4`, and filled area underneath.

Lines 47-56 handle the point styling. I made the points fairly large with white borders so they're easy to see and hover over.

#### Lines 58-66: Segment Styling

This is probably the coolest Chart.js feature I used! The `segment.borderColor` callback runs for each segment between two points. I check if the Y value is going up or down — if it's rising, I color it green, if it's falling, I color it red. This makes trends immediately visible without even reading the numbers.

#### Lines 72-96: Chart Creation and Configuration

Lines 85-91 set up dynamic titles. When compare mode is OFF, the title says "GDP Comparison by Country" and Y-axis shows "GDP (Trillion USD)". When compare mode is ON, it changes to "GDP Growth Comparison" and shows percentage. This dynamic labeling helps users understand what they're looking at.

#### Lines 103-127: Delayed Animation

This creates that cool "drawing" effect where lines appear sequentially. The `delay` function calculates timing based on both `datasetIndex` and `dataIndex`. So basically, the first country's first point appears immediately, then each subsequent point has a small delay, and then the second country starts after the first one finishes. It creates this cascading animation that's much more engaging than everything appearing at once.

#### Lines 129-155: Custom Tooltip

The tooltip callback customizes what users see when they hover. Lines 142-146 check if the current value is higher or lower than the previous year and add a ▲ or ▼ arrow. Lines 148-152 format the display differently based on mode — in compare mode it shows "+58.2%", in normal mode it shows "$28.8 Trillion". This contextual formatting makes the data easier to understand.

#### Lines 179-202: Play Timeline Feature

The `startPlayback` function is basically a slideshow for data. I use `setInterval` at 800ms intervals. Each tick, I increment `currentYearIndex` and recreate the chart with only data up to that year. So users see 2015 first, then 2015-2016, then 2015-2017, and so on. It's like watching a time-lapse of economic growth.

#### Lines 220-235: Event Listeners

These wire up all the interactivity. When users click a country chip, it toggles selection and redraws the chart. The play button starts or stops the timeline. The compare mode button toggles the data transformation. And the base year dropdown changes the reference point for comparison.

---

## Part 4: Troubleshooting & Reflection

### Challenge 1: Animation Timing

**Problem:** When I first added the delayed animation, all the lines would start at weird times and overlap.

**Solution:** I had to carefully calculate the delay using both the dataset index AND the data point index. The formula `datasetIndex * totalPoints * delayBetweenPoints + dataIndex * delayBetweenPoints` ensures each country waits for the previous one to finish.

**What I learned:** Animation timing in Chart.js is tricky — you need to think about the total duration, not just individual delays.

### Challenge 2: Compare Mode with Playback

**Problem:** When playing the timeline in compare mode, the percentage calculations were wrong because the base year data might not be visible yet.

**Solution:** I made sure the `getChartData` function always has access to the full dataset for calculating the base value, even if we're only displaying partial data.

**What I learned:** Data transformations need to be independent of display logic.

### Challenge 3: Segment Coloring

**Problem:** At first, the segment colors weren't updating when I switched countries.

**Solution:** I realized I need to destroy and recreate the chart instead of just updating the data. Chart.js caches the segment styling on first render.

**What I learned:** Some Chart.js features require full chart recreation, not just data updates.

### Future Improvements

1. Add a slider for year range selection instead of just play/pause
2. Add export functionality to save the chart as an image
3. Add more chart types (bar chart view option)

---

## Part 5: Conclusion

So that's my World GDP Visualization project! To recap:

**Files covered:**
- `data.js` — The dataset with 100 data points and color configuration
- `main.js` — The Chart.js implementation with all custom effects

**Key Chart.js features demonstrated:**
- Gradient fills using Canvas API
- Segment styling with callback functions
- Delayed animation with custom timing
- Dynamic labels and titles
- Custom tooltip formatting
- Legend toggle (built-in)

**What I'm most proud of:** The segment coloring feature that shows green for growth and red for decline. It makes the data tell a story at a glance — you can immediately see that 2020 was a tough year for most economies, and which countries recovered fastest.

Thanks for watching!

---

*Script prepared for Core Lab Fall 2025*
