export interface AlgorithmDescription {
  id: string
  name: string
  category: 'graph' | 'sorting'
  summary: string
  howItWorks: string[]
  whenToUse: string[]
  limitations: string[]
  keyProperties: {
    label: string
    value: string
  }[]
}

export const algorithmDescriptions: Record<string, AlgorithmDescription> = {
  // ---------------------------------------------------------------------------
  // GRAPH ALGORITHMS
  // ---------------------------------------------------------------------------
  bfs: {
    id: 'bfs',
    name: 'Breadth-First Search (BFS)',
    category: 'graph',
    summary:
      'Explores a graph level-by-level starting from a root node, visiting all direct neighbors before moving deeper.',
    howItWorks: [
      'Initialize a Queue (FIFO) and enqueue the start node.',
      'Mark the start node as visited.',
      'Dequeue a node, inspect it, and add all unvisited neighbors to the queue.',
      'Repeat until the queue is empty or the target node is found.',
    ],
    whenToUse: [
      'Finding the shortest path in unweighted graphs.',
      'Level-order traversal in trees or social networks (e.g., degree of separation).',
      'Web crawlers discovering web pages level by level.',
    ],
    limitations: [
      'High memory overhead O(V) as all nodes at the current depth must be stored in the queue.',
      'Does not account for edge weights or travel costs.',
    ],
    keyProperties: [
      { label: 'Data Structure', value: 'Queue (FIFO)' },
      { label: 'Guarantees Shortest Path', value: 'Yes (Unweighted only)' },
      { label: 'Completeness', value: 'Guaranteed on finite graphs' },
    ],
  },

  dfs: {
    id: 'dfs',
    name: 'Depth-First Search (DFS)',
    category: 'graph',
    summary:
      'Explores as far down a single branch as possible before backtracking to explore alternate branches.',
    howItWorks: [
      'Push the start node onto a Stack or initiate a recursive function call.',
      'Mark the current node as visited.',
      'Recursively visit an unvisited neighbor, diving deep into the graph path.',
      'Backtrack to previous branches when a dead end or visited node is encountered.',
    ],
    whenToUse: [
      'Topological sorting and dependency resolution.',
      'Detecting cycles in a directed or undirected graph.',
      'Solving mazes and puzzles where exploring a single path fully is required.',
    ],
    limitations: [
      'Does NOT guarantee the shortest path.',
      'Can get trapped in infinitely deep branches if cycle checking is missed.',
    ],
    keyProperties: [
      { label: 'Data Structure', value: 'Stack / Call Stack' },
      { label: 'Guarantees Shortest Path', value: 'No' },
      { label: 'Space Complexity', value: 'O(V) including visited set and recursion stack' },
    ],
  },

  dijkstra: {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm",
    category: 'graph',
    summary:
      'Calculates the single-source shortest path pathways across a non-negative weighted graph.',
    howItWorks: [
      'Set origin node distance to 0 and all other nodes to Infinity.',
      'Greedily select the unvisited node with the absolute smallest tentative distance.',
      'For each neighbor, calculate prospective path weight: currentDistance + edgeWeight.',
      'If prospective cost is lower than recorded cost, relax the edge and update shortest distance.',
      'Mark the current node as settled/visited.',
    ],
    whenToUse: [
      'GPS and digital map routing (Google Maps, OpenStreetMap).',
      'Network routing protocols (e.g., OSPF).',
      'Resource expenditure optimization across weighted transport networks.',
    ],
    limitations: [
      'Requires non-negative edge weights for its shortest-path correctness guarantee. Negative weights can produce incorrect results.',
      'Slower than A* search because it expands blindly in all directions.',
    ],
    keyProperties: [
      { label: 'Data Structure', value: 'Min-Priority Queue / Array' },
      { label: 'Handles Negative Edges', value: 'No' },
      { label: 'Greedy Choice', value: 'Smallest known distance' },
    ],
  },

  astar: {
    id: 'astar',
    name: 'A* Search',
    category: 'graph',
    summary:
      'An informed best-first search algorithm that finds the shortest path using both actual cost (g) and estimated distance (h).',
    howItWorks: [
      'Maintain an open set sorted by total evaluation cost: f(n) = g(n) + h(n).',
      'g(n) represents the actual path cost from the start node to the current node.',
      'h(n) represents the heuristic estimated cost from the current node to the goal target.',
      'Pop node with minimal f(n) value, evaluate unvisited neighbors, and update tentative scores.',
      'Stop immediately once the target node is extracted from the open set.',
    ],
    whenToUse: [
      'Video game pathfinding (moving units around terrain and obstacles).',
      'Robotics spatial navigation and obstacle avoidance.',
      'Grid and spatial map routing where target coordinates are known.',
    ],
    limitations: [
      'Performance heavily depends on the quality of the heuristic function h(n).',
      'Can consume significant memory storing expanded node scores in memory.',
    ],
    keyProperties: [
      { label: 'Evaluation Metric', value: 'f(n) = g(n) + h(n)' },
      { label: 'Heuristic Metric', value: 'Euclidean / Manhattan' },
      { label: 'Guarantees Optimal Path', value: 'With suitable admissible and consistent heuristic assumptions' },
    ],
  },

  'bellman-ford': {
    id: 'bellman-ford',
    name: 'Bellman-Ford',
    category: 'graph',
    summary:
      'Computes single-source shortest paths on weighted graphs and can handle negative edge weights.',
    howItWorks: [
      'Initialize start distance to 0 and all other nodes to Infinity.',
      'Iterate through ALL graph edges |V| - 1 times, relaxing every edge where a cheaper path exists.',
      'Execute an extra (|V|-th) pass to check if any distance can still be reduced.',
      'If a distance reduces during the extra pass, flag a negative cycle error.',
    ],
    whenToUse: [
      'Graphs containing negative edge weights (e.g., cost vs. reward modeling).',
      'Financial arbitrage detection across foreign exchange currency trading graphs.',
      'Distance-vector routing protocols (e.g., Routing Information Protocol - RIP).',
    ],
    limitations: [
      'Higher time complexity O(V · E) compared to Dijkstra O(E log V).',
      'Cannot return valid paths if a negative weight cycle exists.',
    ],
    keyProperties: [
      { label: 'Pass Count', value: '|V| - 1 iterations' },
      { label: 'Negative Weight Support', value: 'Yes' },
      { label: 'Negative Cycle Detection', value: 'Yes' },
    ],
  },

  // ---------------------------------------------------------------------------
  // SORTING ALGORITHMS
  // ---------------------------------------------------------------------------
  bubbleSort: {
    id: 'bubbleSort',
    name: 'Bubble Sort',
    category: 'sorting',
    summary:
      'Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
    howItWorks: [
      'Iterate over the array starting from index 0.',
      'Compare adjacent pairs: if arr[i] > arr[i+1], swap them.',
      'After each pass, the largest unsorted element bubbles up to its correct final index.',
      'Repeat until no swaps occur during an entire pass.',
    ],
    whenToUse: [
      'Educational demonstrations of simple sorting logic.',
      'Nearly-sorted datasets where early-exit optimization achieves O(N) performance.',
    ],
    limitations: [
      'Highly inefficient O(N²) quadratic time complexity on large datasets.',
    ],
    keyProperties: [
      { label: 'In-Place', value: 'Yes' },
      { label: 'Stable', value: 'Yes' },
      { label: 'Best Time Complexity', value: 'O(N)' },
    ],
  },

  selectionSort: {
    id: 'selectionSort',
    name: 'Selection Sort',
    category: 'sorting',
    summary:
      'Divides the array into a sorted and an unsorted region, repeatedly picking the smallest element from the unsorted region.',
    howItWorks: [
      'Find the minimum element in the unsorted sub-array.',
      'Swap it with the first unsorted element.',
      'Advance the boundary separating the sorted and unsorted regions by one element.',
      'Repeat until the entire array is sorted.',
    ],
    whenToUse: [
      'Small datasets where minimizing memory writes/swaps is critical (executes at most O(N) swaps).',
    ],
    limitations: [
      'Always runs in O(N²) time regardless of whether the array is already sorted.',
      'Unstable by default due to long-distance swaps.',
    ],
    keyProperties: [
      { label: 'In-Place', value: 'Yes' },
      { label: 'Stable', value: 'No' },
      { label: 'Total Swaps', value: 'O(N)' },
    ],
  },

  insertionSort: {
    id: 'insertionSort',
    name: 'Insertion Sort',
    category: 'sorting',
    summary:
      'Builds the final sorted array one item at a time by repeatedly shifting larger elements right to insert the current item.',
    howItWorks: [
      'Pick the next element from the unsorted portion.',
      'Compare it against items in the sorted portion from right to left.',
      'Shift larger elements one position to the right.',
      'Insert the element into its correct sorted position.',
    ],
    whenToUse: [
      'Small datasets (typically < 10–20 elements).',
      'Online streaming data where items arrive sequentially.',
      'Hybrid sorting algorithms like Timsort or Introsort as a base case.',
    ],
    limitations: [
      'Scales poorly to O(N²) on reverse-sorted or large random inputs.',
    ],
    keyProperties: [
      { label: 'In-Place', value: 'Yes' },
      { label: 'Stable', value: 'Yes' },
      { label: 'Best Time Complexity', value: 'O(N)' },
    ],
  },

  mergeSort: {
    id: 'mergeSort',
    name: 'Merge Sort',
    category: 'sorting',
    summary:
      'A divide-and-conquer algorithm that recursively splits the array into halves, sorts them, and merges them back together.',
    howItWorks: [
      'Divide the unsorted array into two halves until single-element sub-arrays remain.',
      'Recursively sort both sub-arrays.',
      'Merge the sorted sub-arrays by comparing head elements and building a combined sorted array.',
    ],
    whenToUse: [
      'When guaranteed O(N log N) worst-case performance is required.',
      'Sorting linked lists or large external datasets that cannot fit entirely in memory.',
    ],
    limitations: [
      'Requires O(N) extra space allocation for temporary storage arrays.',
    ],
    keyProperties: [
      { label: 'In-Place', value: 'No (O(N) aux space)' },
      { label: 'Stable', value: 'Yes' },
      { label: 'Worst-Case Time', value: 'O(N log N)' },
    ],
  },

  quickSort: {
    id: 'quickSort',
    name: 'Quick Sort',
    category: 'sorting',
    summary:
      'Selects a pivot element and partitions the array around it so smaller items move left and larger items move right.',
    howItWorks: [
      'Select a pivot element (e.g., last element or random selection).',
      'Partition the array: place elements smaller than pivot to its left, larger to its right.',
      'Recursively apply Quick Sort to the sub-arrays on the left and right of the pivot.',
    ],
    whenToUse: [
      'General-purpose fast in-place sorting for arrays.',
      'Systems where cache-locality and low overhead matter most.',
    ],
    limitations: [
      'Worst-case performance degrades to O(N²) with poor pivot choices (e.g., sorted array with last element pivot).',
      'Unstable sort.',
    ],
    keyProperties: [
      { label: 'In-Place', value: 'Yes' },
      { label: 'Stable', value: 'No' },
      { label: 'Average-Case Time', value: 'O(N log N)' },
    ],
  },

  heapSort: {
    id: 'heapSort',
    name: 'Heap Sort',
    category: 'sorting',
    summary:
      'Transforms the array into a Max-Heap binary tree structure to repeatedly extract the maximum value.',
    howItWorks: [
      'Build a Max-Heap binary tree from the unsorted input array.',
      'Swap the root (maximum element) with the last element of the heap.',
      'Reduce the heap size boundary by 1 and call heapify to restore the Max-Heap property.',
      'Repeat until all elements are extracted.',
    ],
    whenToUse: [
      'Systems requiring guaranteed O(N log N) performance with strictly O(1) auxiliary space constraints.',
      'Embedded systems with constrained memory footprint.',
    ],
    limitations: [
      'Poor CPU cache locality compared to Quick Sort due to non-contiguous heap index jumps.',
      'Unstable sort.',
    ],
    keyProperties: [
      { label: 'In-Place', value: 'Yes' },
      { label: 'Stable', value: 'No' },
      { label: 'Auxiliary Space', value: 'O(log N) — recursive heapify stack' },
    ],
  },
} 