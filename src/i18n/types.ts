export interface Translations {
  appTitle: string;
  controls: {
    rows: string;
    cols: string;
    landProbability: string;
    algorithm: string;
    dfs: string;
    bfs: string;
    generateRandom: string;
    example1: string;
    example2: string;
    customGrid: string;
    submit: string;
    calculate: string;
    customGridPlaceholder: string;
  };
  animation: {
    play: string;
    pause: string;
    reset: string;
    stepForward: string;
    stepBackward: string;
    jumpToStart: string;
    jumpToEnd: string;
    speed: string;
    speedTooltip: string;
    stepInfo: string;
    progressTooltip: string;
    speedSelectTooltip: string;
    checkingPosition: string;
    isWater: string;
    isNewLand: string;
    isVisitedLand: string;
    islandsFound: string;
    searchComplete: string;
    startingSearch: string;
    exploring: string;
  };
  results: {
    islands: string;
    message: string;
  };
  legend: {
    title: string;
    water: string;
    land: string;
    visited: string;
    visitedSubText: string;
    current: string;
    exploring: string;
  };
  languageSelector: {
    title: string;
    english: string;
    chinese: string;
  };
  dataStructure: {
    stack: string;
    queue: string;
    emptyStack: string;
    emptyQueue: string;
    stackTop: string;
    stackBottom: string;
    queueFront: string;
    queueBack: string;
    lifo: string;
    fifo: string;
    totalElements: string;
  };
  algorithmSteps: {
    initialState: string;
    foundLand: string;
    addToStack: string;
    addToQueue: string;
    visitingCell: string;
    exploreDirection: string;
    addedToStack: string;
    addedToQueue: string;
    queueElements: string;
    visitedPopStack: string;
    returnToPosition: string;
    emptyStackComplete: string;
    emptyQueueComplete: string;
    checkPositionWater: string;
    checkPositionVisited: string;
    foundNewIsland: string;
    foundUnvisitedLand: string;
    islandSearchComplete: string;
    algorithmComplete: string;
    cellAlreadyVisited: string;
  };
  common: {
    viewOnGitHub: string;
    sourceCode: string;
  };
  errors: {
    invalidGridData: string;
    inconsistentRowLength: string;
    maxRowsExceeded: string;
    maxColsExceeded: string;
    parseError: string;
  };
} 