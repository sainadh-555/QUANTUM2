import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Shuffle,
  Binary,
  Clock,
  Database,
  Code2,
  Info,
  CheckCircle2
} from 'lucide-react';

const ALGORITHM_LIST = [
  {
    id: 'bubble_sort',
    name: 'Bubble Sort',
    category: 'Sorting',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    description: 'Compares adjacent pairs in an array and swaps them if they are in descending order, bubbling the largest value to the end.',
    pseudocode: [
      'for i from 0 to n - 1:',
      '  for j from 0 to n - i - 2:',
      '    if array[j] > array[j + 1]:',
      '      swap(array[j], array[j + 1])'
    ]
  },
  {
    id: 'selection_sort',
    name: 'Selection Sort',
    category: 'Sorting',
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    description: 'Finds the minimum element from the unsorted subarray and puts it at the beginning, repeating until sorted.',
    pseudocode: [
      'for i from 0 to n - 1:',
      '  min_idx = i',
      '  for j from i + 1 to n - 1:',
      '    if array[j] < array[min_idx]: min_idx = j',
      '  swap(array[i], array[min_idx])'
    ]
  },
  {
    id: 'binary_search',
    name: 'Binary Search',
    category: 'Searching',
    timeComplexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
    spaceComplexity: 'O(1)',
    description: 'Search a sorted array by repeatedly dividing the search interval in half. Compares target with the middle element.',
    pseudocode: [
      'low = 0, high = n - 1',
      'while low <= high:',
      '  mid = floor((low + high) / 2)',
      '  if array[mid] == target: return mid',
      '  else if array[mid] < target: low = mid + 1',
      '  else: high = mid - 1'
    ]
  },
  {
    id: 'bfs',
    name: 'Breadth-First Search (BFS)',
    category: 'Graph / Tree',
    timeComplexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
    spaceComplexity: 'O(V)',
    description: 'Traverses a graph level by level using a First-In-First-Out (FIFO) queue, visiting all immediate neighbors first.',
    pseudocode: [
      'queue.enqueue(start_node)',
      'mark start_node as visited',
      'while queue is not empty:',
      '  current = queue.dequeue()',
      '  for neighbor of current:',
      '    if neighbor not visited:',
      '      queue.enqueue(neighbor)'
    ]
  },
  {
    id: 'dfs',
    name: 'Depth-First Search (DFS)',
    category: 'Graph / Tree',
    timeComplexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
    spaceComplexity: 'O(V)',
    description: 'Explores as deep as possible along each branch before backtracking using a Last-In-First-Out (LIFO) call stack.',
    pseudocode: [
      'function dfs(node):',
      '  mark node as visited',
      '  for neighbor of node:',
      '    if neighbor not visited:',
      '      dfs(neighbor)'
    ]
  },
  {
    id: 'dijkstra',
    name: 'Dijkstra\'s Shortest Path',
    category: 'Greedy / Graph',
    timeComplexity: { best: 'O((V + E) log V)', average: 'O((V + E) log V)', worst: 'O((V + E) log V)' },
    spaceComplexity: 'O(V)',
    description: 'Computes the shortest path from a starting source node to all other nodes in a weighted graph with non-negative edge weights.',
    pseudocode: [
      'dist[source] = 0, others = infinity',
      'min_heap.insert((0, source))',
      'while min_heap not empty:',
      '  (d, u) = min_heap.extract_min()',
      '  for (v, weight) in neighbors(u):',
      '    if dist[u] + weight < dist[v]:',
      '      dist[v] = dist[u] + weight'
    ]
  },
  {
    id: 'astar',
    name: 'A* Heuristic Search',
    category: 'Pathfinding',
    timeComplexity: { best: 'O(E)', average: 'O(b^d)', worst: 'O(b^d)' },
    spaceComplexity: 'O(b^d)',
    description: 'Informed search algorithm that uses both actual cost $g(n)$ and heuristic distance $h(n)$ to efficiently navigate grid graphs: $f(n) = g(n) + h(n)$.',
    pseudocode: [
      'open_set = [start_node]',
      'f_score[start] = h(start)',
      'while open_set not empty:',
      '  current = node in open_set with min f_score',
      '  if current == goal: return reconstruct_path()',
      '  for neighbor of current: evaluate f_score'
    ]
  }
];

export default function AlgorithmVisualizer() {
  const [selectedAlgo, setSelectedAlgo] = useState(ALGORITHM_LIST[0]);
  
  // Array State for Sorting (Requested example: [5, 2, 8, 1, 3] or expanded)
  const initialArray = [5, 2, 8, 1, 3, 9, 4, 7, 6];
  const [array, setArray] = useState(initialArray);
  
  // Animation / Visualizer State
  const [activeIndices, setActiveIndices] = useState([]); // indices being compared
  const [swappingIndices, setSwappingIndices] = useState([]); // indices being swapped
  const [sortedIndices, setSortedIndices] = useState([]); // indices finalized
  const [activeCodeLine, setActiveCodeLine] = useState(0);

  // Metrics
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);

  // Playback Control
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(400); // ms per step
  const timerRef = useRef(null);

  // Pre-computed animation frames
  const framesRef = useRef([]);
  const frameIdxRef = useRef(0);

  // Generate sorting animation frames for Bubble Sort
  const generateBubbleSortFrames = (arrInput) => {
    const arr = [...arrInput];
    const frames = [];
    const n = arr.length;
    let compCount = 0;
    let swapCount = 0;
    const sorted = [];

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        compCount++;
        // Compare frame
        frames.push({
          array: [...arr],
          activeIndices: [j, j + 1],
          swappingIndices: [],
          sortedIndices: [...sorted],
          comparisons: compCount,
          swaps: swapCount,
          codeLine: 2
        });

        if (arr[j] > arr[j + 1]) {
          // Swap
          swapCount++;
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;

          // Swap frame
          frames.push({
            array: [...arr],
            activeIndices: [j, j + 1],
            swappingIndices: [j, j + 1],
            sortedIndices: [...sorted],
            comparisons: compCount,
            swaps: swapCount,
            codeLine: 3
          });
        }
      }
      sorted.push(n - i - 1);
      frames.push({
        array: [...arr],
        activeIndices: [],
        swappingIndices: [],
        sortedIndices: [...sorted],
        comparisons: compCount,
        swaps: swapCount,
        codeLine: 0
      });
    }

    // All sorted frame
    frames.push({
      array: [...arr],
      activeIndices: [],
      swappingIndices: [],
      sortedIndices: Array.from({ length: n }, (_, i) => i),
      comparisons: compCount,
      swaps: swapCount,
      codeLine: 0
    });

    return frames;
  };

  // Generate sorting animation frames for Selection Sort
  const generateSelectionSortFrames = (arrInput) => {
    const arr = [...arrInput];
    const frames = [];
    const n = arr.length;
    let compCount = 0;
    let swapCount = 0;
    const sorted = [];

    for (let i = 0; i < n; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        compCount++;
        frames.push({
          array: [...arr],
          activeIndices: [minIdx, j],
          swappingIndices: [],
          sortedIndices: [...sorted],
          comparisons: compCount,
          swaps: swapCount,
          codeLine: 3
        });

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
      }

      if (minIdx !== i) {
        swapCount++;
        const temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;

        frames.push({
          array: [...arr],
          activeIndices: [i, minIdx],
          swappingIndices: [i, minIdx],
          sortedIndices: [...sorted],
          comparisons: compCount,
          swaps: swapCount,
          codeLine: 4
        });
      }
      sorted.push(i);
    }

    frames.push({
      array: [...arr],
      activeIndices: [],
      swappingIndices: [],
      sortedIndices: Array.from({ length: n }, (_, i) => i),
      comparisons: compCount,
      swaps: swapCount,
      codeLine: 0
    });

    return frames;
  };

  // Generate Binary Search Frames
  const generateBinarySearchFrames = (arrInput) => {
    const sortedArr = [...arrInput].sort((a, b) => a - b);
    const target = 7;
    const frames = [];
    let low = 0;
    let high = sortedArr.length - 1;
    let compCount = 0;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      compCount++;

      frames.push({
        array: [...sortedArr],
        activeIndices: [low, mid, high],
        swappingIndices: [],
        sortedIndices: [],
        comparisons: compCount,
        swaps: 0,
        codeLine: 2
      });

      if (sortedArr[mid] === target) {
        frames.push({
          array: [...sortedArr],
          activeIndices: [],
          swappingIndices: [],
          sortedIndices: [mid],
          comparisons: compCount,
          swaps: 0,
          codeLine: 3
        });
        break;
      } else if (sortedArr[mid] < target) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return frames;
  };

  // Prepare frames when algorithm or array changes
  useEffect(() => {
    handleReset();
  }, [selectedAlgo]);

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);

    let frames = [];
    if (selectedAlgo.id === 'selection_sort') {
      frames = generateSelectionSortFrames(array);
    } else if (selectedAlgo.id === 'binary_search') {
      const sorted = [...array].sort((a, b) => a - b);
      setArray(sorted);
      frames = generateBinarySearchFrames(sorted);
    } else {
      frames = generateBubbleSortFrames(array);
    }

    framesRef.current = frames;
    frameIdxRef.current = 0;

    if (frames.length > 0) {
      const f0 = frames[0];
      setArray(f0.array);
      setActiveIndices(f0.activeIndices);
      setSwappingIndices(f0.swappingIndices);
      setSortedIndices(f0.sortedIndices);
      setComparisons(0);
      setSwaps(0);
      setActiveCodeLine(0);
    }
  };

  // Step Forward
  const handleStep = () => {
    if (frameIdxRef.current < framesRef.current.length - 1) {
      frameIdxRef.current += 1;
      const f = framesRef.current[frameIdxRef.current];
      setArray(f.array);
      setActiveIndices(f.activeIndices);
      setSwappingIndices(f.swappingIndices);
      setSortedIndices(f.sortedIndices);
      setComparisons(f.comparisons);
      setSwaps(f.swaps);
      setActiveCodeLine(f.codeLine);
    } else {
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  // Play / Pause loop
  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setIsPlaying(true);
      timerRef.current = setInterval(() => {
        if (frameIdxRef.current < framesRef.current.length - 1) {
          handleStep();
        } else {
          setIsPlaying(false);
          clearInterval(timerRef.current);
        }
      }, speed);
    }
  };

  // Clean up timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Update playback interval on speed change
  useEffect(() => {
    if (isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(handleStep, speed);
    }
  }, [speed]);

  // Randomize Array
  const handleRandomize = () => {
    const newArr = Array.from({ length: 9 }, () => Math.floor(Math.random() * 9) + 1);
    setArray(newArr);
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);

    let frames;
    if (selectedAlgo.id === 'selection_sort') {
      frames = generateSelectionSortFrames(newArr);
    } else if (selectedAlgo.id === 'binary_search') {
      const sorted = [...newArr].sort((a, b) => a - b);
      setArray(sorted);
      frames = generateBinarySearchFrames(sorted);
    } else {
      frames = generateBubbleSortFrames(newArr);
    }

    framesRef.current = frames;
    frameIdxRef.current = 0;
    setComparisons(0);
    setSwaps(0);
    setActiveIndices([]);
    setSwappingIndices([]);
    setSortedIndices([]);
  };

  return (
    <div className="flex-1 w-full h-[calc(100vh-64px)] bg-[#040612] text-gray-100 flex flex-col lg:flex-row overflow-hidden select-none">
      
      {/* Left Sidebar: Algorithm Directory */}
      <aside className="w-full lg:w-80 h-[35vh] lg:h-full bg-[#070a19] border-r border-white/10 p-4 flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Binary className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-gray-100 uppercase tracking-wider font-['Space_Grotesk']">
              Algorithm Catalog
            </h3>
          </div>

          <div className="space-y-2">
            {ALGORITHM_LIST.map(algo => (
              <button
                key={algo.id}
                onClick={() => setSelectedAlgo(algo)}
                className={`w-full p-3 rounded-xl text-left border transition-all ${
                  selectedAlgo.id === algo.id
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm shadow-cyan-500/20'
                    : 'bg-white/[0.02] text-gray-300 border-white/5 hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold">{algo.name}</span>
                  <span className="text-[10px] font-mono text-gray-400">{algo.category}</span>
                </div>
                <div className="flex gap-2 text-[10px] font-mono text-gray-400">
                  <span>Time: {algo.timeComplexity.worst}</span>
                  <span>•</span>
                  <span>Space: {algo.spaceComplexity}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 text-[11px] text-gray-500 font-mono">
          SIH Visual CS Algorithm Suite
        </div>
      </aside>

      {/* Main Visualizer Stage */}
      <main className="flex-1 flex flex-col h-[65vh] lg:h-full bg-[#050714] overflow-y-auto p-4 sm:p-6 space-y-6">
        
        {/* Stage Header & Algorithm Overview */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-extrabold text-white font-['Space_Grotesk']">
                {selectedAlgo.name}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                {selectedAlgo.category}
              </span>
            </div>
            <p className="text-xs text-gray-400 max-w-xl font-sans">
              {selectedAlgo.description}
            </p>
          </div>

          {/* Educational Telemetry Badges */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center min-w-[90px]">
              <span className="block text-[10px] text-gray-400">Comparisons</span>
              <span className="text-cyan-300 font-bold text-sm">{comparisons}</span>
            </div>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center min-w-[90px]">
              <span className="block text-[10px] text-gray-400">Swaps / Shifts</span>
              <span className="text-amber-300 font-bold text-sm">{swaps}</span>
            </div>
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center min-w-[90px]">
              <span className="block text-[10px] text-gray-400">Worst Case</span>
              <span className="text-purple-300 font-bold text-sm">{selectedAlgo.timeComplexity.worst}</span>
            </div>
          </div>
        </div>

        {/* Visualizer Canvas Area: Bars & Array Elements */}
        <div className="flex-1 min-h-[220px] bg-[#070b1f] border border-white/10 rounded-2xl p-6 flex flex-col justify-end items-center relative overflow-hidden shadow-inner">
          
          {/* Animated Bar Graph */}
          <div className="w-full max-w-lg flex items-end justify-center gap-3 h-44 pb-6">
            {array.map((val, idx) => {
              const isComparing = activeIndices.includes(idx);
              const isSwapping = swappingIndices.includes(idx);
              const isSorted = sortedIndices.includes(idx);

              let barColor = 'bg-cyan-500/60 border-cyan-400';
              let shadow = 'none';

              if (isSwapping) {
                barColor = 'bg-rose-500 border-rose-300';
                shadow = '0 0 15px #f43f5e';
              } else if (isComparing) {
                barColor = 'bg-amber-400 border-amber-200';
                shadow = '0 0 15px #f59e0b';
              } else if (isSorted) {
                barColor = 'bg-emerald-500/80 border-emerald-300';
                shadow = '0 0 10px #10b981';
              }

              const heightPct = Math.max(15, (val / 10) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-xs font-mono font-bold text-gray-200">{val}</span>
                  <div
                    className={`w-full rounded-t-lg border-t-2 border-x-2 transition-all duration-200 ${barColor}`}
                    style={{
                      height: `${heightPct}%`,
                      boxShadow: shadow
                    }}
                  />
                  <span className="text-[10px] font-mono text-gray-500">[{idx}]</span>
                </div>
              );
            })}
          </div>

          {/* State Legend */}
          <div className="absolute top-4 left-4 flex items-center gap-4 text-[10px] font-mono text-gray-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Normal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Comparing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Swapping</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Sorted</span>
            </div>
          </div>

        </div>

        {/* Playback Controls & Speed Slider Bar */}
        <div className="p-4 rounded-2xl bg-[#070b1f] border border-white/10 flex flex-wrap items-center justify-between gap-4">
          
          {/* Main Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePlay}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                isPlaying
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/20'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start</span>
                </>
              )}
            </button>

            <button
              onClick={handleStep}
              disabled={isPlaying}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 disabled:opacity-40"
              title="Step Forward"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleRandomize}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 hover:text-white border border-white/5"
              title="Generate New Random Array"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Randomize</span>
            </button>
          </div>

          {/* Speed Slider */}
          <div className="flex items-center gap-3 text-xs font-mono text-gray-300">
            <span>Speed:</span>
            <input
              type="range"
              min="100"
              max="900"
              step="50"
              value={1000 - speed}
              onChange={(e) => setSpeed(1000 - Number(e.target.value))}
              className="w-28 sm:w-36 accent-cyan-400"
            />
            <span className="text-[10px] text-cyan-400 font-bold min-w-[40px]">
              {speed <= 250 ? 'Fast' : speed <= 550 ? 'Normal' : 'Slow'}
            </span>
          </div>

        </div>

        {/* Pseudocode Walkthrough Box */}
        <div className="p-4 rounded-2xl bg-[#060817] border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-300">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span>Algorithm Pseudocode</span>
          </div>
          <div className="p-3 rounded-xl bg-black/40 font-mono text-xs space-y-1">
            {selectedAlgo.pseudocode.map((line, idx) => (
              <div
                key={idx}
                className={`px-2 py-0.5 rounded transition-colors ${
                  activeCodeLine === idx
                    ? 'bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400'
                    : 'text-gray-400'
                }`}
              >
                {line}
              </div>
            ))}
          </div>
        </div>

      </main>

    </div>
  );
}
