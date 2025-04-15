import { Translations } from '../types';

const zhTranslation: Translations = {
  appTitle: "LeetCode 200 - 岛屿数量可视化计算器",
  controls: {
    rows: "行数：",
    cols: "列数：",
    landProbability: "陆地概率：",
    algorithm: "算法：",
    dfs: "深度优先搜索",
    bfs: "广度优先搜索",
    generateRandom: "生成随机网格",
    example1: "示例1",
    example2: "示例2",
    customGrid: "自定义网格：",
    submit: "提交",
    calculate: "计算岛屿数量",
    customGridPlaceholder: "例如:\n10010\n11000\n00100\n00011"
  },
  animation: {
    play: "播放",
    pause: "暂停",
    reset: "重置",
    stepForward: "前进一步",
    stepBackward: "后退一步",
    jumpToStart: "跳到开始",
    jumpToEnd: "跳到结束",
    speed: "速度：",
    speedTooltip: "调整动画播放速度",
    stepInfo: "当前步数 / 总步数",
    progressTooltip: "拖动滑块以跳转到特定步骤",
    speedSelectTooltip: "点击选择播放速度",
    checkingPosition: "检查位置 ({{row}}, {{col}})",
    isWater: " - 水域，继续搜索",
    isNewLand: " - 发现新陆地，开始探索新岛屿",
    isVisitedLand: " - 已访问过的陆地，继续搜索",
    islandsFound: "已发现 {{count}} 个岛屿",
    searchComplete: " - 搜索完成！",
    startingSearch: "开始遍历网格寻找岛屿...",
    exploring: " - 向{{direction}}探索"
  },
  results: {
    islands: "岛屿数量：{{count}}",
    message: "消息：{{message}}"
  },
  legend: {
    title: "图例",
    water: "水域",
    land: "陆地",
    visited: "已访问",
    visitedSubText: "(Vn表示第n个岛屿)",
    current: "当前位置",
    exploring: "探索方向"
  },
  languageSelector: {
    title: "语言",
    english: "English",
    chinese: "简体中文"
  },
  dataStructure: {
    stack: "栈",
    queue: "队列",
    emptyStack: "栈为空",
    emptyQueue: "队列为空",
    stackTop: "顶部",
    stackBottom: "底部",
    queueFront: "队首",
    queueBack: "队尾",
    lifo: "后进先出",
    fifo: "先进先出",
    totalElements: "共 {{count}} 个元素"
  },
  algorithmSteps: {
    initialState: "初始状态：绿色表示陆地(1)，白色表示水域(0)。",
    foundLand: "发现陆地 ({{row}},{{col}})，开始搜索新岛屿。将其加入栈。",
    addToStack: "将 ({{row}},{{col}}) 加入栈。",
    addToQueue: "将 ({{row}},{{col}}) 加入队列。",
    visitingCell: "当前正在访问单元格 ({{row}},{{col}})。",
    exploreDirection: "从 ({{row}},{{col}}) 向{{direction}}方向探索，发现陆地 ({{newRow}},{{newCol}})。将其加入栈。",
    addedToStack: "将 ({{row}},{{col}}) 加入栈。",
    addedToQueue: "将 ({{row}},{{col}}) 加入队列。队列现有 {{count}} 个元素。",
    queueElements: "队列元素：{{count}}",
    visitedPopStack: "单元格 ({{row}},{{col}}) 的所有邻居都已访问，将其从栈中弹出。",
    returnToPosition: "返回到 ({{row}},{{col}})。",
    emptyStackComplete: "单元格 ({{row}},{{col}}) 的所有邻居都已访问，将其从栈中弹出。栈为空，岛屿搜索完成。",
    emptyQueueComplete: "队列为空，当前岛屿搜索完成。",
    checkPositionWater: "检查位置 ({{row}},{{col}}) - 水域，继续搜索。",
    checkPositionVisited: "检查位置 ({{row}},{{col}}) - 已访问过的区域，继续搜索。",
    foundNewIsland: "发现第 {{count}} 个岛屿，从 ({{row}},{{col}}) 开始搜索。",
    foundUnvisitedLand: "检查位置 ({{row}},{{col}})，发现未访问的陆地，开始BFS搜索。",
    islandSearchComplete: "完成一个岛屿的搜索，当前岛屿数量: {{count}}。",
    algorithmComplete: "算法完成！共发现 {{count}} 个岛屿。",
    cellAlreadyVisited: "单元格 ({{row}},{{col}}) 已被访问过，跳过。"
  },
  common: {
    viewOnGitHub: "在GitHub上查看",
    sourceCode: "源代码"
  },
  errors: {
    invalidGridData: "输入的网格数据无效，请检查格式",
    inconsistentRowLength: "输入的网格数据行长度不一致，请检查格式",
    maxRowsExceeded: "网格行数不能超过50行",
    maxColsExceeded: "网格列数不能超过50列",
    parseError: "解析输入数据时出错，请检查格式"
  }
};

export default zhTranslation; 