import { Translations } from '../types';

const enTranslation: Translations = {
  appTitle: "LeetCode 200 - Number of Islands Visualizer",
  controls: {
    rows: "Rows:",
    cols: "Columns:",
    landProbability: "Land Probability:",
    algorithm: "Algorithm:",
    dfs: "DFS",
    bfs: "BFS",
    generateRandom: "Generate Random Grid",
    example1: "Example 1",
    example2: "Example 2",
    customGrid: "Custom Grid:",
    submit: "Submit",
    calculate: "Calculate Islands",
    customGridPlaceholder: "Example:\n10010\n11000\n00100\n00011"
  },
  animation: {
    play: "Play",
    pause: "Pause",
    reset: "Reset",
    stepForward: "Step Forward",
    stepBackward: "Step Back",
    jumpToStart: "Jump to Start",
    jumpToEnd: "Jump to End",
    speed: "Speed:",
    speedTooltip: "Adjust animation playback speed",
    stepInfo: "Current step / Total steps",
    progressTooltip: "Drag slider to jump to a specific step",
    speedSelectTooltip: "Click to select playback speed",
    checkingPosition: "Checking position ({{row}}, {{col}})",
    isWater: " - Water, continue searching",
    isNewLand: " - New land found, starting to explore new island",
    isVisitedLand: " - Visited land, continue searching",
    islandsFound: "Found {{count}} islands",
    searchComplete: " - Search complete!",
    startingSearch: "Starting to search for islands...",
    exploring: " - Exploring {{direction}}"
  },
  results: {
    islands: "Islands: {{count}}",
    message: "Message: {{message}}"
  },
  legend: {
    title: "Legend",
    water: "Water",
    land: "Land",
    visited: "Visited",
    visitedSubText: "(Vn indicates the n-th island)",
    current: "Current",
    exploring: "Exploring Direction"
  },
  languageSelector: {
    title: "Language",
    english: "English",
    chinese: "简体中文"
  },
  dataStructure: {
    stack: "Stack",
    queue: "Queue",
    emptyStack: "Stack is empty",
    emptyQueue: "Queue is empty",
    stackTop: "Top",
    stackBottom: "Bottom",
    queueFront: "Front",
    queueBack: "Back",
    lifo: "Last In, First Out",
    fifo: "First In, First Out",
    totalElements: "Total: {{count}} elements"
  },
  algorithmSteps: {
    initialState: "Initial state: green represents land(1), white represents water(0).",
    foundLand: "Found land at ({{row}},{{col}}), starting to search new island. Adding it to stack.",
    addToStack: "Adding ({{row}},{{col}}) to stack.",
    addToQueue: "Adding ({{row}},{{col}}) to queue.",
    visitingCell: "Currently visiting cell ({{row}},{{col}}).",
    exploreDirection: "From ({{row}},{{col}}) exploring {{direction}} direction, found land at ({{newRow}},{{newCol}}). Adding it to stack.",
    addedToStack: "Added ({{row}},{{col}}) to stack.",
    addedToQueue: "Added ({{row}},{{col}}) to queue. Queue now has {{count}} elements.",
    queueElements: "Queue elements: {{count}}",
    visitedPopStack: "Cell ({{row}},{{col}}) has all neighbors visited, popping it from stack.",
    returnToPosition: "Returning to ({{row}},{{col}}).",
    emptyStackComplete: "Cell ({{row}},{{col}}) has all neighbors visited, popping it from stack. Stack is empty, island search complete.",
    emptyQueueComplete: "Queue is empty, current island search complete.",
    checkPositionWater: "Checking position ({{row}},{{col}}) - Water, continue searching.",
    checkPositionVisited: "Checking position ({{row}},{{col}}) - Already visited area, continue searching.",
    foundNewIsland: "Found island #{{count}}, starting search from ({{row}},{{col}}).",
    foundUnvisitedLand: "Checking position ({{row}},{{col}}), found unvisited land, starting BFS search.",
    islandSearchComplete: "Completed searching an island, current island count: {{count}}.",
    algorithmComplete: "Algorithm complete! Found {{count}} islands total.",
    cellAlreadyVisited: "Cell ({{row}},{{col}}) has already been visited, skipping."
  },
  common: {
    viewOnGitHub: "View on GitHub",
    sourceCode: "Source Code"
  },
  errors: {
    invalidGridData: "Invalid grid data, please check the format",
    inconsistentRowLength: "Grid rows have inconsistent lengths, please check the format",
    maxRowsExceeded: "Grid cannot exceed 50 rows",
    maxColsExceeded: "Grid cannot exceed 50 columns",
    parseError: "Error parsing input data, please check the format"
  }
};

export default enTranslation; 