import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Plus, Trash2, GripHorizontal, X, ChevronDown, ChevronRight, 
  FileText, Network, FolderOpen, Palette, Check, ZoomIn, ZoomOut, Focus,
  Download, Upload, Undo2, Redo2, Layers, Link2, ExternalLink, HelpCircle,
  Sparkles, CheckSquare, Clock, AlertCircle, BarChart2, PanelLeftClose, PanelLeft,
  Grid, Move, Copy, ArrowUp, ArrowDown, RefreshCw, LayoutList, MonitorSpeaker,
  MoreVertical, ImageIcon, ChevronUp, Scissors, ClipboardPaste, Minimize2, Maximize2,
  Lock, Shield, Eye, EyeOff, GitBranch
} from 'lucide-react';

// --- Premium Color Themes ---
const THEMES = {
  amber: { 
    name: 'Amber Glow', 
    wrapper: 'bg-[#fdfbf7] border-amber-200/80 hover:border-amber-400/50', 
    header: 'bg-[#fffbeb] border-amber-200', 
    tag: 'bg-amber-100/80 border-amber-300 text-amber-800', 
    port: 'bg-amber-500 hover:bg-amber-400 border-amber-100', 
    text: 'text-amber-900', 
    line: '#f59e0b',
    groupBg: 'bg-amber-50/10 border-amber-300/40', 
    groupHeader: 'bg-amber-100/40 border-amber-200/50',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]'
  },
  blue: { 
    name: 'Ocean Blue', 
    wrapper: 'bg-slate-50 border-blue-200/80 hover:border-blue-400/50', 
    header: 'bg-blue-50/80 border-blue-200', 
    tag: 'bg-blue-100/80 border-blue-300 text-blue-800', 
    port: 'bg-blue-500 hover:bg-blue-400 border-blue-100', 
    text: 'text-blue-900', 
    line: '#3b82f6',
    groupBg: 'bg-blue-50/10 border-blue-300/40', 
    groupHeader: 'bg-blue-100/40 border-blue-200/50',
    glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]'
  },
  emerald: { 
    name: 'Mint Emerald', 
    wrapper: 'bg-emerald-50/20 border-emerald-200/80 hover:border-emerald-400/50', 
    header: 'bg-emerald-50/80 border-emerald-200', 
    tag: 'bg-emerald-100/80 border-emerald-300 text-emerald-800', 
    port: 'bg-emerald-500 hover:bg-emerald-400 border-emerald-100', 
    text: 'text-emerald-900', 
    line: '#10b981',
    groupBg: 'bg-emerald-50/10 border-emerald-300/40', 
    groupHeader: 'bg-emerald-100/40 border-emerald-200/50',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]'
  },

  purple: { 
    name: 'Royal Purple', 
    wrapper: 'bg-purple-50/20 border-purple-200/80 hover:border-purple-400/50', 
    header: 'bg-purple-50/80 border-purple-200', 
    tag: 'bg-purple-100/80 border-purple-300 text-purple-800', 
    port: 'bg-purple-500 hover:bg-purple-400 border-purple-100', 
    text: 'text-purple-900', 
    line: '#8b5cf6',
    groupBg: 'bg-purple-50/10 border-purple-300/40', 
    groupHeader: 'bg-purple-100/40 border-purple-200/50',
    glow: 'shadow-[0_0_20px_rgba(139,92,246,0.15)]'
  },
  rose: { 
    name: 'Blush Rose', 
    wrapper: 'bg-rose-50/20 border-rose-200/80 hover:border-rose-400/50', 
    header: 'bg-rose-50/80 border-rose-200', 
    tag: 'bg-rose-100/80 border-rose-300 text-rose-800', 
    port: 'bg-rose-500 hover:bg-rose-400 border-rose-100', 
    text: 'text-rose-900', 
    line: '#f43f5e',
    groupBg: 'bg-rose-50/10 border-rose-300/40', 
    groupHeader: 'bg-rose-100/40 border-rose-200/50',
    glow: 'shadow-[0_0_20px_rgba(244,63,94,0.15)]'
  }
};

const defaultWorkspaces = [
  {
    id: 'ws-1', name: 'Product Launch Roadmap',
    groups: [
      { id: 'g-1', name: 'Phase 1: Discovery & Research', x: 80, y: 80, width: 440, height: 440, expanded: true, theme: 'amber', parentGroupId: null },
      { id: 'g-2', name: 'Phase 2: Product Design UI', x: 580, y: 80, width: 440, height: 440, expanded: true, theme: 'purple', parentGroupId: null }
    ],
    nodes: [
      { id: '1', x: 130, y: 150, title: 'User Interviews', content: 'Synthesize feedback from 15 target users.', expanded: true, theme: 'amber', groupId: 'g-1', status: 'In Progress', priority: 'High', nodeType: 'task', cloneSourceId: null },
      { id: '2', x: 130, y: 310, title: 'Competitor Benchmark', content: 'Benchmark workflows against Top 3 competitors.', expanded: true, theme: 'blue', groupId: 'g-1', status: 'Todo', priority: 'Medium', nodeType: 'task', cloneSourceId: null },
      { id: '3', x: 630, y: 150, title: 'Component Library', content: 'Establish design system in Figma.', expanded: true, theme: 'purple', groupId: 'g-2', status: 'In Progress', priority: 'High', nodeType: 'task', cloneSourceId: null },
      { id: '4', x: 1100, y: 200, title: 'Launch Strategy Plan', content: 'Define GTM parameters.', expanded: true, theme: 'rose', groupId: null, status: 'Todo', priority: 'Low', nodeType: 'task', cloneSourceId: null }
    ],
    edges: [
      { id: 'e1', source: '1', target: '3' },
      { id: 'e2', source: '2', target: '3' },
      { id: 'e3', source: '3', target: '4' }
    ]
  }
];


// --- Recursive Hierarchy Helpers ---
const isDescendantOf = (childId, parentId, groupsList) => {
  let curr = groupsList.find(g => g.id === childId);
  while (curr && curr.parentGroupId) {
    if (curr.parentGroupId === parentId) return true;
    curr = groupsList.find(g => g.id === curr.parentGroupId);
  }
  return false;
};

const getDescendants = (groupId, currentGroups, currentNodes) => {
  let descendantGroupIds = [];
  let descendantNodeIds = [];

  const recurse = (id) => {
    const childGroups = currentGroups.filter(g => g.parentGroupId === id);
    childGroups.forEach(cg => {
      descendantGroupIds.push(cg.id);
      recurse(cg.id);
    });
    const childNodes = currentNodes.filter(n => n.groupId === id);
    childNodes.forEach(cn => {
      descendantNodeIds.push(cn.id);
    });
  };

  recurse(groupId);
  return { descendantGroupIds, descendantNodeIds };
};

const isGroupHidden = (groupId, currentGroups) => {
  let currId = groupId;
  while (currId) {
    const pGroup = currentGroups.find(g => g.id === currId);
    if (!pGroup) break;
    if (!pGroup.expanded) {
      return true;
    }
    currId = pGroup.parentGroupId;
  }
  return false;
};

const shareCollapsedAncestor = (nodeA, nodeB, currentGroups) => {
  if (!nodeA.groupId || !nodeB.groupId) return false;
  
  const getCollapsedAncestors = (groupId) => {
    const ancestors = [];
    let currId = groupId;
    while (currId) {
      const g = currentGroups.find(x => x.id === currId);
      if (!g) break;
      if (!g.expanded) ancestors.push(g.id);
      currId = g.parentGroupId;
    }
    return ancestors;
  };

  const ancestorsA = getCollapsedAncestors(nodeA.groupId);
  const ancestorsB = getCollapsedAncestors(nodeB.groupId);

  return ancestorsA.some(id => ancestorsB.includes(id));
};


// --- Bottom-up Layout Auto-adjuster ---
const computeLayout = (currentGroups, currentNodes) => {
  if (!currentGroups || currentGroups.length === 0) return currentGroups;

  const getDepth = (g) => {
    let depth = 0;
    let curr = g;
    while (curr && curr.parentGroupId) {
      depth++;
      curr = currentGroups.find(p => p.id === curr.parentGroupId);
    }
    return depth;
  };

  const groupsWithDepth = currentGroups.map(g => ({
    ...g,
    depth: getDepth(g)
  }));

  groupsWithDepth.sort((a, b) => b.depth - a.depth);

  const computed = {};
  currentGroups.forEach(g => {
    computed[g.id] = { 
      x: g.x, 
      y: g.y, 
      width: g.width || 440, 
      height: g.height || 420 
    };
  });

  groupsWithDepth.forEach(group => {
    const innerNodes = currentNodes.filter(n => n.groupId === group.id);
    const innerSubgroups = currentGroups.filter(g => g.parentGroupId === group.id);

    if (!group.expanded) {
      computed[group.id] = {
        x: group.x,
        y: group.y,
        width: group.width || 340,
        height: 64
      };
      return;
    }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let hasChildren = false;

    innerNodes.forEach(n => {
      hasChildren = true;
      const nW = 340;
      const nH = n.expanded ? 280 : 120;
      minX = Math.min(minX, n.x);
      minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x + nW);
      maxY = Math.max(maxY, n.y + nH);
    });


    innerSubgroups.forEach(sg => {
      hasChildren = true;
      const comp = computed[sg.id];
      minX = Math.min(minX, comp.x);
      minY = Math.min(minY, comp.y);
      maxX = Math.max(maxX, comp.x + comp.width);
      maxY = Math.max(maxY, comp.y + comp.height);
    });

    if (hasChildren) {
      const paddingX = 30;
      const paddingTop = 60;
      const paddingBottom = 40;

      const calculatedX = minX - paddingX;
      const calculatedY = minY - paddingTop;
      const calculatedW = (maxX - minX) + (paddingX * 2);
      const calculatedH = (maxY - minY) + paddingTop + paddingBottom;

      computed[group.id] = {
        x: calculatedX,
        y: calculatedY,
        width: Math.max(calculatedW, group.manualWidth || 440),
        height: Math.max(calculatedH, group.manualHeight || 420)
      };
    } else {
      computed[group.id] = {
        x: group.x,
        y: group.y,
        width: Math.max(group.width || 440, group.manualWidth || 440),
        height: Math.max(group.height || 420, group.manualHeight || 420)
      };
    }
  });

  return currentGroups.map(g => {
    const comp = computed[g.id];
    return {
      ...g,
      x: comp.x,
      y: comp.y,
      width: comp.width,
      height: comp.height
    };
  });
};


export default function WorkflowApp() {
  // --- Core State ---
  const [workspaces, setWorkspaces] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const [nextId, setNextId] = useState(10);
  const [initialized, setInitialized] = useState(false);
  const workspaceRef = useRef(null);

  // --- UI Layout Panels ---
  const [showSidebar, setShowSidebar] = useState(true);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);

  // --- Dragging & Resizing Interactions ---
  const [draggingNode, setDraggingNode] = useState(null);
  const [draggingGroup, setDraggingGroup] = useState(null);
  const [resizingGroup, setResizingGroup] = useState(null);
  const [dragHoveredGroupId, setDragHoveredGroupId] = useState(null);

  const [connecting, setConnecting] = useState(null);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [openColorPicker, setOpenColorPicker] = useState(null);
  const [openLinkPicker, setOpenLinkPicker] = useState(null);
  const [editingTab, setEditingTab] = useState(null);
  const [editingTextNode, setEditingTextNode] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [nodeContextMenu, setNodeContextMenu] = useState(null);
  const [dragOverNodeId, setDragOverNodeId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [pendingImageDrop, setPendingImageDrop] = useState(null);
  const [focusedNodeId, setFocusedNodeId] = useState(null);
  const [focusedGroupId, setFocusedGroupId] = useState(null);
  const [groupContextMenu, setGroupContextMenu] = useState(null);

  // --- Clone Panel States ---
  const [showClonePanel, setShowClonePanel] = useState(false);
  const [selectedCloneSourceId, setSelectedCloneSourceId] = useState(null);

  const fileInputRef = useRef(null);

  // --- History (Undo/Redo) States ---
  const pastRef = useRef([]);
  const futureRef = useRef([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  
  const stateRef = useRef({ workspaces: defaultWorkspaces, activeTab: 'ws-1', nextId: 10 });
  const dragSnapshot = useRef(null);

  // --- Pan & Zoom States ---
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });


  // --- Dual Viewport Engine ---
  const [viewMode, setViewMode] = useState('canvas');
  const [mobileSheet, setMobileSheet] = useState(null);
  const [expandedOutlineCards, setExpandedOutlineCards] = useState({});

  // --- Password Protection ---
  const [passwordEnabled, setPasswordEnabled] = useState(false);
  const [storedPassword, setStoredPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [showGatePassword, setShowGatePassword] = useState(false);

  // --- Touch Gesture Refs (Pinch-to-Zoom) ---
  const touchRef = useRef({ isPinching: false, lastDist: 0, lastMidX: 0, lastMidY: 0 });
  const nodeTapRef = useRef(null);

  // --- Coordinate Mapping Helpers ---
  const getWorkspaceCoords = useCallback((e) => {
    if (!workspaceRef.current) return { x: 0, y: 0 };
    const rect = workspaceRef.current.getBoundingClientRect();
    return { 
      x: (e.clientX - rect.left - transform.x) / transform.scale, 
      y: (e.clientY - rect.top - transform.y) / transform.scale 
    };
  }, [transform]);

  // --- Zoom Helpers ---
  const handleZoom = useCallback((delta) => {
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.2, Math.min(3, prev.scale + delta))
    }));
  }, []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setTransform(prev => {
      const newScale = Math.max(0.2, Math.min(3, prev.scale + delta));
      if (!workspaceRef.current) return prev;
      const rect = workspaceRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const scaleFactor = newScale / prev.scale;
      return {
        scale: newScale,
        x: mouseX - scaleFactor * (mouseX - prev.x),
        y: mouseY - scaleFactor * (mouseY - prev.y)
      };
    });
  }, []);

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    if (!workspaceRef.current) return;
    const rect = workspaceRef.current.getBoundingClientRect();
    const isClickBg = e.target === workspaceRef.current || e.target.classList.contains('canvas-grid-clickable');
    if (!isClickBg) return;
    setContextMenu({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      clientX: e.clientX,
      clientY: e.clientY
    });
    setNodeContextMenu(null);
    setGroupContextMenu(null);
  }, []);


  // --- Touch Gesture Handlers (Pinch-to-Zoom & One-Finger Pan) ---
  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      setIsPanning(false);
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      touchRef.current = {
        isPinching: true,
        lastDist: dist,
        lastMidX: (t1.clientX + t2.clientX) / 2,
        lastMidY: (t1.clientY + t2.clientY) / 2,
      };
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length === 2 && touchRef.current.isPinching) {
      e.preventDefault();
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const midX = (t1.clientX + t2.clientX) / 2;
      const midY = (t1.clientY + t2.clientY) / 2;

      const scaleDelta = dist / Math.max(touchRef.current.lastDist, 1);

      setTransform(prev => {
        const newScale = Math.max(0.2, Math.min(3, prev.scale * scaleDelta));
        if (!workspaceRef.current) return prev;
        const rect = workspaceRef.current.getBoundingClientRect();
        const localMidX = midX - rect.left;
        const localMidY = midY - rect.top;
        const sf = newScale / prev.scale;
        return {
          scale: newScale,
          x: localMidX - sf * (localMidX - prev.x),
          y: localMidY - sf * (localMidY - prev.y),
        };
      });

      touchRef.current.lastDist = dist;
      touchRef.current.lastMidX = midX;
      touchRef.current.lastMidY = midY;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    touchRef.current = { isPinching: false, lastDist: 0, lastMidX: 0, lastMidY: 0 };
  }, []);


  // --- Initialization & Auto-Save ---
  useEffect(() => {
    try {
      const savedWs = localStorage.getItem('premium-workspaces');
      const savedTab = localStorage.getItem('premium-active-tab');
      const savedCounter = localStorage.getItem('premium-counter');

      let initialWorkspaces = defaultWorkspaces;
      let initialTab = 'ws-1';
      let initialNextId = 10;

      if (savedWs) {
         const parsedWs = JSON.parse(savedWs);
         if (parsedWs && Array.isArray(parsedWs)) {
             initialWorkspaces = parsedWs.map(ws => {
               const grps = ws.groups || [];
               const nds = ws.nodes || [];
               return {
                 ...ws,
                 groups: computeLayout(grps, nds),
                 nodes: nds,
                 edges: ws.edges || []
               };
             });
         }
      }
      
      if (savedTab) initialTab = savedTab;
      else if (initialWorkspaces.length > 0) initialTab = initialWorkspaces[0].id;
      
      if (savedCounter) initialNextId = parseInt(savedCounter, 10) || 10;

      setWorkspaces(initialWorkspaces);
      setActiveTab(initialTab);
      setNextId(initialNextId);

      // Initialize password protection state
      const savedPasswordEnabled = localStorage.getItem('nexus-password-enabled');
      const savedPassword = localStorage.getItem('nexus-password');
      if (savedPasswordEnabled === 'true' && savedPassword) {
        setPasswordEnabled(true);
        setStoredPassword(savedPassword);
      }
    } catch (e) {
      setWorkspaces(defaultWorkspaces);
      setActiveTab('ws-1');
      setNextId(10);
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    stateRef.current = { workspaces, activeTab, nextId };
  }, [workspaces, activeTab, nextId]);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem('premium-workspaces', JSON.stringify(workspaces));
      localStorage.setItem('premium-active-tab', activeTab);
      localStorage.setItem('premium-counter', nextId.toString());
    }
  }, [workspaces, activeTab, nextId, initialized]);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem('nexus-password-enabled', passwordEnabled ? 'true' : 'false');
      localStorage.setItem('nexus-password', storedPassword);
    }
  }, [passwordEnabled, storedPassword, initialized]);

  useEffect(() => {
    setFocusedNodeId(null);
  }, [activeTab]);

  // --- Auto-hide sidebar on small screens ---
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // --- History Actions ---
  const updateHistory = useCallback((past, future) => {
    pastRef.current = past;
    futureRef.current = future;
    setCanUndo(past.length > 0);
    setCanRedo(future.length > 0);
  }, []);

  const takeSnapshot = useCallback(() => {
    const newPast = [...pastRef.current, JSON.parse(JSON.stringify(stateRef.current))];
    updateHistory(newPast, []);
  }, [updateHistory]);

  const performUndo = useCallback(() => {
    if (pastRef.current.length === 0) return;
    const newPast = [...pastRef.current];
    const prev = newPast.pop();
    
    const newFuture = [JSON.parse(JSON.stringify(stateRef.current)), ...futureRef.current];
    
    updateHistory(newPast, newFuture);
    
    setWorkspaces(prev.workspaces);
    setActiveTab(prev.activeTab);
    setNextId(prev.nextId);
  }, [updateHistory]);

  const performRedo = useCallback(() => {
    if (futureRef.current.length === 0) return;
    const newFuture = [...futureRef.current];
    const next = newFuture.shift();
    
    const newPast = [...pastRef.current, JSON.parse(JSON.stringify(stateRef.current))];
    
    updateHistory(newPast, newFuture);
    
    setWorkspaces(next.workspaces);
    setActiveTab(next.activeTab);
    setNextId(next.nextId);
  }, [updateHistory]);

  const activeWs = workspaces.find(w => w.id === activeTab) || workspaces[0];
  const nodes = activeWs?.nodes || [];
  const edges = activeWs?.edges || [];
  const groups = activeWs?.groups || [];

  const updateActiveWorkspace = useCallback((updater) => {
    setWorkspaces(prev => prev.map(ws => ws.id === activeTab ? { ...ws, ...updater(ws) } : ws));
  }, [activeTab]);

  // --- Copy/Cut/Paste Node Functions ---
  const copyNode = useCallback((nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    const clipData = {
      node: { ...node, id: undefined },
      action: 'copy',
      sourceWorkspaceId: activeTab,
      sourceNodeId: nodeId,
      timestamp: Date.now()
    };
    localStorage.setItem('nexus-clipboard', JSON.stringify(clipData));
    localStorage.removeItem('nexus-clipboard-group');
  }, [nodes, activeTab]);

  const cutNode = useCallback((nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    const clipData = {
      node: { ...node, id: undefined },
      action: 'cut',
      sourceWorkspaceId: activeTab,
      sourceNodeId: nodeId,
      timestamp: Date.now()
    };
    localStorage.setItem('nexus-clipboard', JSON.stringify(clipData));
    localStorage.removeItem('nexus-clipboard-group');
  }, [nodes, activeTab]);

  const pasteNode = useCallback((targetX, targetY) => {
    const clipJson = localStorage.getItem('nexus-clipboard');
    if (!clipJson) return;
    try {
      const clipData = JSON.parse(clipJson);
      if (!clipData.node) return;

      takeSnapshot();

      let pasteX = targetX;
      let pasteY = targetY;
      if (pasteX === undefined || pasteY === undefined) {
        if (workspaceRef.current) {
          const rect = workspaceRef.current.getBoundingClientRect();
          pasteX = (rect.width / 2 - transform.x) / transform.scale - 170;
          pasteY = (rect.height / 2 - transform.y) / transform.scale - 80;
        } else {
          pasteX = 200;
          pasteY = 200;
        }
      }

      const newNode = {
        ...clipData.node,
        id: nextId.toString(),
        x: pasteX,
        y: pasteY,
        groupId: null,
        cloneSourceId: null
      };

      if (clipData.action === 'cut') {
        // Atomic: paste + remove source in one setWorkspaces call
        setWorkspaces(prev => prev.map(ws => {
          if (ws.id === activeTab) {
            // Add pasted node to active workspace
            const updatedNodes = [...ws.nodes, newNode];
            let resultWs = {
              ...ws,
              nodes: updatedNodes,
              groups: computeLayout(ws.groups, updatedNodes)
            };
            // If source is ALSO active workspace, remove source from same update
            if (clipData.sourceWorkspaceId === activeTab) {
              const filteredNodes = resultWs.nodes.filter(n => n.id !== clipData.sourceNodeId);
              resultWs = {
                ...resultWs,
                nodes: filteredNodes,
                edges: resultWs.edges.filter(e => e.source !== clipData.sourceNodeId && e.target !== clipData.sourceNodeId),
                groups: computeLayout(resultWs.groups, filteredNodes)
              };
            }
            return resultWs;
          } else if (ws.id === clipData.sourceWorkspaceId) {
            // Remove source from different workspace
            const filteredNodes = ws.nodes.filter(n => n.id !== clipData.sourceNodeId);
            return {
              ...ws,
              nodes: filteredNodes,
              edges: ws.edges.filter(e => e.source !== clipData.sourceNodeId && e.target !== clipData.sourceNodeId),
              groups: computeLayout(ws.groups, filteredNodes)
            };
          }
          return ws;
        }));
      } else {
        // Copy: just add to active workspace
        updateActiveWorkspace(ws => {
          const updatedNodes = [...ws.nodes, newNode];
          return {
            nodes: updatedNodes,
            groups: computeLayout(ws.groups, updatedNodes)
          };
        });
      }

      setNextId(prev => prev + 1);
      localStorage.removeItem('nexus-clipboard');
    } catch (e) {
      // Invalid clipboard data, ignore
    }
  }, [takeSnapshot, nextId, transform, updateActiveWorkspace, setWorkspaces, activeTab]);

  // --- Copy/Cut/Paste Group Functions ---
  const copyGroup = useCallback((groupId) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    const { descendantGroupIds, descendantNodeIds } = getDescendants(groupId, groups, nodes);
    const allGroupIds = [groupId, ...descendantGroupIds];
    const allNodeIds = [...new Set([...descendantNodeIds, ...nodes.filter(n => n.groupId === groupId).map(n => n.id)])];
    
    const groupData = groups.filter(g => allGroupIds.includes(g.id));
    const nodeData = nodes.filter(n => allNodeIds.includes(n.id));
    const nodeIdSet = new Set(allNodeIds);
    const edgeData = edges.filter(e => nodeIdSet.has(e.source) && nodeIdSet.has(e.target));

    // Store positions relative to the root group's top-left
    const originX = group.x;
    const originY = group.y;

    const clipData = {
      groups: groupData.map(g => ({ ...g, x: g.x - originX, y: g.y - originY })),
      nodes: nodeData.map(n => ({ ...n, x: n.x - originX, y: n.y - originY })),
      edges: edgeData,
      action: 'copy',
      sourceWorkspaceId: activeTab,
      sourceGroupId: groupId,
      timestamp: Date.now()
    };
    localStorage.setItem('nexus-clipboard-group', JSON.stringify(clipData));
    localStorage.removeItem('nexus-clipboard');
  }, [groups, nodes, edges, activeTab]);

  const cutGroup = useCallback((groupId) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    const { descendantGroupIds, descendantNodeIds } = getDescendants(groupId, groups, nodes);
    const allGroupIds = [groupId, ...descendantGroupIds];
    const allNodeIds = [...new Set([...descendantNodeIds, ...nodes.filter(n => n.groupId === groupId).map(n => n.id)])];
    
    const groupData = groups.filter(g => allGroupIds.includes(g.id));
    const nodeData = nodes.filter(n => allNodeIds.includes(n.id));
    const nodeIdSet = new Set(allNodeIds);
    const edgeData = edges.filter(e => nodeIdSet.has(e.source) && nodeIdSet.has(e.target));

    const originX = group.x;
    const originY = group.y;

    const clipData = {
      groups: groupData.map(g => ({ ...g, x: g.x - originX, y: g.y - originY })),
      nodes: nodeData.map(n => ({ ...n, x: n.x - originX, y: n.y - originY })),
      edges: edgeData,
      action: 'cut',
      sourceWorkspaceId: activeTab,
      sourceGroupId: groupId,
      sourceGroupIds: allGroupIds,
      sourceNodeIds: allNodeIds,
      timestamp: Date.now()
    };
    localStorage.setItem('nexus-clipboard-group', JSON.stringify(clipData));
    localStorage.removeItem('nexus-clipboard');
  }, [groups, nodes, edges, activeTab]);

  const pasteGroup = useCallback((targetX, targetY) => {
    const clipJson = localStorage.getItem('nexus-clipboard-group');
    if (!clipJson) return;
    try {
      const clipData = JSON.parse(clipJson);
      if (!clipData.groups || clipData.groups.length === 0) return;

      takeSnapshot();

      let pasteX = targetX;
      let pasteY = targetY;
      if (pasteX === undefined || pasteY === undefined) {
        if (workspaceRef.current) {
          const rect = workspaceRef.current.getBoundingClientRect();
          pasteX = (rect.width / 2 - transform.x) / transform.scale - 200;
          pasteY = (rect.height / 2 - transform.y) / transform.scale - 150;
        } else {
          pasteX = 200;
          pasteY = 200;
        }
      }

      // Generate new IDs for all groups, nodes, and edges
      let idCounter = nextId;
      const groupIdMap = {};
      const nodeIdMap = {};

      clipData.groups.forEach(g => {
        groupIdMap[g.id] = `g-${Date.now()}-${idCounter}`;
        idCounter++;
      });
      clipData.nodes.forEach(n => {
        nodeIdMap[n.id] = idCounter.toString();
        idCounter++;
      });

      const newGroups = clipData.groups.map(g => ({
        ...g,
        id: groupIdMap[g.id],
        x: g.x + pasteX,
        y: g.y + pasteY,
        parentGroupId: g.parentGroupId ? groupIdMap[g.parentGroupId] || null : null
      }));

      const newNodes = clipData.nodes.map(n => ({
        ...n,
        id: nodeIdMap[n.id],
        x: n.x + pasteX,
        y: n.y + pasteY,
        groupId: n.groupId ? groupIdMap[n.groupId] || null : null
      }));

      const newEdges = clipData.edges.map(e => ({
        ...e,
        id: `e-${Date.now()}-${idCounter++}`,
        source: nodeIdMap[e.source] || e.source,
        target: nodeIdMap[e.target] || e.target
      }));

      if (clipData.action === 'cut') {
        setWorkspaces(prev => prev.map(ws => {
          if (ws.id === activeTab) {
            let updatedNodes = [...ws.nodes, ...newNodes];
            let updatedGroups = [...ws.groups, ...newGroups];
            let updatedEdges = [...ws.edges, ...newEdges];
            // If source is also active workspace, remove originals
            if (clipData.sourceWorkspaceId === activeTab) {
              updatedNodes = updatedNodes.filter(n => !clipData.sourceNodeIds.includes(n.id));
              updatedGroups = updatedGroups.filter(g => !clipData.sourceGroupIds.includes(g.id));
              const sourceNodeSet = new Set(clipData.sourceNodeIds);
              updatedEdges = updatedEdges.filter(e => !sourceNodeSet.has(e.source) && !sourceNodeSet.has(e.target));
            }
            return {
              ...ws,
              nodes: updatedNodes,
              edges: updatedEdges,
              groups: computeLayout(updatedGroups, updatedNodes)
            };
          } else if (ws.id === clipData.sourceWorkspaceId) {
            const updatedNodes = ws.nodes.filter(n => !clipData.sourceNodeIds.includes(n.id));
            const sourceNodeSet = new Set(clipData.sourceNodeIds);
            return {
              ...ws,
              nodes: updatedNodes,
              edges: ws.edges.filter(e => !sourceNodeSet.has(e.source) && !sourceNodeSet.has(e.target)),
              groups: computeLayout(ws.groups.filter(g => !clipData.sourceGroupIds.includes(g.id)), updatedNodes)
            };
          }
          return ws;
        }));
      } else {
        updateActiveWorkspace(ws => {
          const updatedNodes = [...ws.nodes, ...newNodes];
          const updatedGroups = [...ws.groups, ...newGroups];
          const updatedEdges = [...ws.edges, ...newEdges];
          return {
            nodes: updatedNodes,
            edges: updatedEdges,
            groups: computeLayout(updatedGroups, updatedNodes)
          };
        });
      }

      setNextId(idCounter);
      localStorage.removeItem('nexus-clipboard-group');
    } catch (e) {
      // Invalid clipboard data, ignore
    }
  }, [takeSnapshot, nextId, transform, updateActiveWorkspace, setWorkspaces, activeTab]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) performRedo();
        else performUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        performRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        if (focusedGroupId) {
          e.preventDefault();
          copyGroup(focusedGroupId);
        } else if (focusedNodeId) {
          e.preventDefault();
          copyNode(focusedNodeId);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'x') {
        if (focusedGroupId) {
          e.preventDefault();
          cutGroup(focusedGroupId);
        } else if (focusedNodeId) {
          e.preventDefault();
          cutNode(focusedNodeId);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        // Prefer group clipboard if it exists
        if (localStorage.getItem('nexus-clipboard-group')) {
          pasteGroup();
        } else {
          pasteNode();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [performUndo, performRedo, copyNode, cutNode, pasteNode, copyGroup, cutGroup, pasteGroup, focusedNodeId, focusedGroupId]);


  // --- Workspace (Tab) Operations ---
  const addWorkspace = () => {
    takeSnapshot();
    const newId = `ws-${Date.now()}`;
    setWorkspaces(prev => [...prev, { id: newId, name: `Map Phase ${prev.length + 1}`, nodes: [], edges: [], groups: [] }]);
    setActiveTab(newId);
    setTransform({ x: 0, y: 0, scale: 1 });
  };

  const deleteWorkspace = (id, e) => {
    e.stopPropagation();
    if (workspaces.length <= 1) return;
    takeSnapshot();
    setWorkspaces(prev => prev.filter(w => w.id !== id));
    if (activeTab === id) setActiveTab(workspaces.find(w => w.id !== id).id);
  };

  const renameWorkspace = (id, newName) => {
    setWorkspaces(prev => prev.map(ws => ws.id === id ? { ...ws, name: newName } : ws));
    setEditingTab(null);
  };

  // --- Import / Export ---
  const exportData = () => {
    const data = { workspaces, activeTab, nextId };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-workflow-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (importedData.workspaces && Array.isArray(importedData.workspaces)) {
          takeSnapshot();
          setWorkspaces(importedData.workspaces);
          setActiveTab(importedData.activeTab || importedData.workspaces[0]?.id || '');
          setNextId(importedData.nextId || 10);
        } else {
          setErrorMessage("Invalid workflow file format.");
        }
      } catch (err) {
        setErrorMessage("Failed to read file.");
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };


  // --- Climb up the dragging hierarchy to fetch active drag-offsets ---
  const getLiveOffset = useCallback((item, parentGroupIdField) => {
    let dx = 0;
    let dy = 0;
    let currParentId = item[parentGroupIdField];

    while (currParentId) {
      const parentGroup = groups.find(g => g.id === currParentId);
      if (!parentGroup) break;

      if (draggingGroup?.id === parentGroup.id) {
        dx += draggingGroup.currentX - parentGroup.x;
        dy += draggingGroup.currentY - parentGroup.y;
        break; 
      }
      currParentId = parentGroup.parentGroupId;
    }
    return { dx, dy };
  }, [groups, draggingGroup]);

  const getLiveCoordinates = useCallback((item, isGroup) => {
    if (!isGroup) {
      if (draggingNode && draggingNode.id === item.id) {
        return { x: draggingNode.currentX, y: draggingNode.currentY };
      }
      const offset = getLiveOffset(item, 'groupId');
      return { x: item.x + offset.dx, y: item.y + offset.dy };
    } else {
      if (draggingGroup && draggingGroup.id === item.id) {
        return { x: draggingGroup.currentX, y: draggingGroup.currentY };
      }
      const offset = getLiveOffset(item, 'parentGroupId');
      return { x: item.x + offset.dx, y: item.y + offset.dy };
    }
  }, [draggingNode, draggingGroup, getLiveOffset]);

  // --- Helper: Node Group Intersection Checker ---
  const getSpatiallyHoveredGroup = useCallback((nodeX, nodeY) => {
    const NODE_WIDTH_VAL = 340;
    const nodeCenterX = nodeX + NODE_WIDTH_VAL / 2;
    const nodeCenterY = nodeY + 80;

    // Collect all groups containing the point
    const containingGroups = [];
    for (const group of groups) {
      const coords = getLiveCoordinates(group, true);
      const gW = group.width || 440;
      const gH = group.height || 420;

      if (
        nodeCenterX >= coords.x &&
        nodeCenterX <= coords.x + gW &&
        nodeCenterY >= coords.y &&
        nodeCenterY <= coords.y + gH
      ) {
        containingGroups.push(group);
      }
    }

    if (containingGroups.length === 0) return null;

    // Return the deepest (most nested) group
    const getDepth = (g) => {
      let depth = 0;
      let curr = g;
      const visited = new Set();
      while (curr && curr.parentGroupId) {
        if (visited.has(curr.id)) break;
        visited.add(curr.id);
        depth++;
        curr = groups.find(p => p.id === curr.parentGroupId);
      }
      return depth;
    };

    containingGroups.sort((a, b) => getDepth(b) - getDepth(a));
    return containingGroups[0].id;
  }, [groups, getLiveCoordinates]);


  // --- Helper: Drag group over parent group ---
  const getSpatiallyHoveredGroupForGroup = useCallback((draggedGroupId, grpX, grpY, grpW, grpH) => {
    const center = {
      x: grpX + grpW / 2,
      y: grpY + 24
    };

    const { descendantGroupIds } = getDescendants(draggedGroupId, groups, nodes);

    for (const targetGroup of groups) {
      if (targetGroup.id === draggedGroupId) continue;
      if (descendantGroupIds.includes(targetGroup.id)) continue;
      if (isDescendantOf(targetGroup.id, draggedGroupId, groups)) continue;

      const coords = getLiveCoordinates(targetGroup, true);
      const tW = targetGroup.width || 440;
      const tH = targetGroup.height || 420;

      if (
        center.x >= coords.x &&
        center.x <= coords.x + tW &&
        center.y >= coords.y &&
        center.y <= coords.y + tH
      ) {
        return targetGroup.id;
      }
    }
    return null;
  }, [groups, nodes, getLiveCoordinates]);

  // --- Pointer Interactions (Pan, Drag & Resize) ---
  const handlePointerDownMain = (e) => {
    if (e.button !== 0) return;
    
    setOpenColorPicker(null);
    setOpenLinkPicker(null);
    setContextMenu(null);
    setNodeContextMenu(null);
    setGroupContextMenu(null);
    setFocusedNodeId(null);
    setFocusedGroupId(null);

    const isClickBg = e.target === workspaceRef.current || e.target.classList.contains('canvas-grid-clickable');
    if (isClickBg) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  };


  const handlePointerMove = useCallback((e) => {
    if (isPanning) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      }));
    } else if (draggingNode) {
      const dx = (e.clientX - draggingNode.startX) / transform.scale;
      const dy = (e.clientY - draggingNode.startY) / transform.scale;
      
      const newX = draggingNode.initialX + dx;
      const newY = draggingNode.initialY + dy;

      setDraggingNode(prev => ({
        ...prev,
        currentX: newX,
        currentY: newY
      }));

      const activeGroupHoverId = getSpatiallyHoveredGroup(newX, newY);
      setDragHoveredGroupId(activeGroupHoverId);

    } else if (draggingGroup) {
      const dx = (e.clientX - draggingGroup.startX) / transform.scale;
      const dy = (e.clientY - draggingGroup.startY) / transform.scale;

      const newX = draggingGroup.initialX + dx;
      const newY = draggingGroup.initialY + dy;

      setDraggingGroup(prev => ({
        ...prev,
        currentX: newX,
        currentY: newY
      }));

      const activeGroupHoverId = getSpatiallyHoveredGroupForGroup(
        draggingGroup.id,
        newX,
        newY,
        draggingGroup.width,
        draggingGroup.height
      );
      setDragHoveredGroupId(activeGroupHoverId);

    } else if (resizingGroup) {
      const dx = (e.clientX - resizingGroup.startX) / transform.scale;
      const dy = (e.clientY - resizingGroup.startY) / transform.scale;

      updateActiveWorkspace(ws => {
        const updatedGroups = ws.groups.map(g => {
          if (g.id === resizingGroup.id) {
            return {
              ...g,
              manualWidth: Math.max(340, resizingGroup.initialWidth + dx),
              manualHeight: Math.max(160, resizingGroup.initialHeight + dy)
            };
          }
          return g;
        });

        return {
          groups: computeLayout(updatedGroups, ws.nodes)
        };
      });
    } else if (connecting) {
      const coords = getWorkspaceCoords(e);
      setConnecting(prev => ({ ...prev, currentX: coords.x, currentY: coords.y }));
    }
  }, [draggingNode, draggingGroup, resizingGroup, isPanning, panStart, transform.scale, getWorkspaceCoords, getSpatiallyHoveredGroup, getSpatiallyHoveredGroupForGroup, updateActiveWorkspace]);


  const handlePointerUp = useCallback(() => {
    if (draggingNode) {
      const movement = Math.hypot(
        draggingNode.currentX - draggingNode.initialX,
        draggingNode.currentY - draggingNode.initialY
      );

      if (movement >= 5) {
        const finalGroupAdoptId = dragHoveredGroupId;

        updateActiveWorkspace(ws => {
          let resolvedGroupId = finalGroupAdoptId;

          // For micro-drags (< 15px), preserve original groupId
          if (movement < 15) {
            const originalNode = ws.nodes.find(n => n.id === draggingNode.id);
            resolvedGroupId = originalNode ? originalNode.groupId : resolvedGroupId;
          } else if (resolvedGroupId === null) {
            const originalNode = ws.nodes.find(n => n.id === draggingNode.id);
            if (originalNode && originalNode.groupId) {
              const originalGroup = ws.groups.find(g => g.id === originalNode.groupId);
              if (originalGroup) {
                const NODE_WIDTH_VAL = 340;
                const nodeCenterX = draggingNode.currentX + NODE_WIDTH_VAL / 2;
                const nodeCenterY = draggingNode.currentY + 80;
                const gW = originalGroup.width || 440;
                const gH = originalGroup.height || 420;

                if (
                  nodeCenterX >= originalGroup.x &&
                  nodeCenterX <= originalGroup.x + gW &&
                  nodeCenterY >= originalGroup.y &&
                  nodeCenterY <= originalGroup.y + gH
                ) {
                  resolvedGroupId = originalNode.groupId;
                }
              }
            }
          }

          const updatedNodes = ws.nodes.map(n => n.id === draggingNode.id 
            ? { ...n, x: draggingNode.currentX, y: draggingNode.currentY, groupId: resolvedGroupId } 
            : n);

          return {
            nodes: updatedNodes,
            groups: computeLayout(ws.groups, updatedNodes)
          };
        });

        if (dragSnapshot.current) {
          const snapshotToSave = dragSnapshot.current;
          const newPast = [...pastRef.current, snapshotToSave];
          updateHistory(newPast, []);
        }
      } else {
        // Click (no drag) - select the node
        setFocusedNodeId(draggingNode.id);
        setFocusedGroupId(null);
        bringToFront(draggingNode.id);
      }
    }

    if (draggingGroup) {
      if (draggingGroup.currentX !== draggingGroup.initialX || draggingGroup.currentY !== draggingGroup.initialY || dragHoveredGroupId !== draggingGroup.parentGroupId) {
        const dx = draggingGroup.currentX - draggingGroup.initialX;
        const dy = draggingGroup.currentY - draggingGroup.initialY;
        const finalParentId = dragHoveredGroupId;

        updateActiveWorkspace(ws => {
          const updatedGroups = ws.groups.map(g => {
            if (g.id === draggingGroup.id) {
              return { ...g, x: g.x + dx, y: g.y + dy, parentGroupId: finalParentId };
            }
            const { descendantGroupIds } = getDescendants(draggingGroup.id, ws.groups, ws.nodes);
            if (descendantGroupIds.includes(g.id)) {
              return { ...g, x: g.x + dx, y: g.y + dy };
            }
            return g;
          });

          const { descendantNodeIds } = getDescendants(draggingGroup.id, ws.groups, ws.nodes);
          const updatedNodes = ws.nodes.map(n => {
            if (descendantNodeIds.includes(n.id)) {
              return { ...n, x: n.x + dx, y: n.y + dy };
            }
            return n;
          });

          return {
            groups: computeLayout(updatedGroups, updatedNodes),
            nodes: updatedNodes
          };
        });

        if (dragSnapshot.current) {
          const snapshotToSave = dragSnapshot.current;
          const newPast = [...pastRef.current, snapshotToSave];
          updateHistory(newPast, []);
        }
      }
    }

    if (resizingGroup) {
      if (dragSnapshot.current) {
        const snapshotToSave = dragSnapshot.current;
        const newPast = [...pastRef.current, snapshotToSave];
        updateHistory(newPast, []);
      }
    }

    setDraggingNode(null);
    setDraggingGroup(null);
    setResizingGroup(null);
    setDragHoveredGroupId(null);
    setConnecting(null);
    setIsPanning(false);
    dragSnapshot.current = null;
  }, [draggingNode, draggingGroup, resizingGroup, dragHoveredGroupId, updateActiveWorkspace, updateHistory]);


  // --- Node, Edge, and Group Creators ---
  const addNode = (clientX, clientY, targetGroupId = null, nodeType = 'task') => {
    takeSnapshot();
    const rect = workspaceRef.current.getBoundingClientRect();
    let targetX, targetY;

    if (clientX !== undefined && clientY !== undefined) {
      targetX = (clientX - rect.left - transform.x) / transform.scale;
      targetY = (clientY - rect.top - transform.y) / transform.scale;
    } else {
      targetX = (rect.width / 2 - transform.x) / transform.scale - 150;
      targetY = (rect.height / 2 - transform.y) / transform.scale - 50;
    }

    const newNode = {
      id: nextId.toString(),
      x: targetX, y: targetY,
      title: nodeType === 'concept' ? 'New Concept' : 'New Workspace Task', content: '', expanded: true, theme: 'amber',
      groupId: targetGroupId, status: 'Todo', priority: 'Medium',
      nodeType: nodeType, cloneSourceId: null
    };
    
    updateActiveWorkspace(ws => {
      const updatedNodes = [...ws.nodes, newNode];
      return {
        nodes: updatedNodes,
        groups: computeLayout(ws.groups, updatedNodes)
      };
    });
    setNextId(prev => prev + 1);
  };

  const createGroup = (clientX, clientY) => {
    takeSnapshot();
    const rect = workspaceRef.current.getBoundingClientRect();
    let targetX, targetY;

    if (clientX !== undefined && clientY !== undefined) {
      targetX = (clientX - rect.left - transform.x) / transform.scale;
      targetY = (clientY - rect.top - transform.y) / transform.scale;
    } else {
      targetX = (rect.width / 2 - transform.x) / transform.scale - 200;
      targetY = (rect.height / 2 - transform.y) / transform.scale - 150;
    }

    const newGroup = {
      id: `g-${Date.now()}`,
      name: 'Dynamic Section',
      x: targetX, y: targetY,
      width: 440, height: 420,
      expanded: true, theme: 'blue',
      parentGroupId: null
    };
    updateActiveWorkspace(ws => ({ groups: [...ws.groups, newGroup] }));
  };

  const duplicateNode = (nodeId) => {
    takeSnapshot();
    const target = nodes.find(n => n.id === nodeId);
    if (!target) return;

    const dup = {
      ...JSON.parse(JSON.stringify(target)),
      id: nextId.toString(),
      x: target.x + 40,
      y: target.y + 40,
      title: `${target.title} (Copy)`,
      cloneSourceId: null
    };

    updateActiveWorkspace(ws => {
      const updatedNodes = [...ws.nodes, dup];
      return {
        nodes: updatedNodes,
        groups: computeLayout(ws.groups, updatedNodes)
      };
    });
    setNextId(prev => prev + 1);
  };

  const cloneNode = (nodeId) => {
    takeSnapshot();
    const target = nodes.find(n => n.id === nodeId);
    if (!target) return;

    // Determine the clone source: if target is already a clone, use its source; otherwise use target itself
    const sourceId = target.cloneSourceId || target.id;

    const clone = {
      id: nextId.toString(),
      x: target.x + 60,
      y: target.y + 60,
      title: target.title,
      content: target.content,
      expanded: true,
      theme: target.theme,
      groupId: null,
      status: target.status || 'Todo',
      priority: target.priority || 'Medium',
      nodeType: target.nodeType || 'task',
      cloneSourceId: sourceId
    };

    updateActiveWorkspace(ws => {
      const updatedNodes = [...ws.nodes, clone];
      return {
        nodes: updatedNodes,
        groups: computeLayout(ws.groups, updatedNodes)
      };
    });
    setNextId(prev => prev + 1);
  };

  const disconnectNodeLinks = (nodeId) => {
    takeSnapshot();
    updateActiveWorkspace(ws => ({
      edges: ws.edges.filter(e => e.source !== nodeId && e.target !== nodeId)
    }));
  };


  const updateGroup = (id, updates) => updateActiveWorkspace(ws => {
    const updatedGroups = ws.groups.map(g => g.id === id ? { ...g, ...updates } : g);
    return {
      groups: computeLayout(updatedGroups, ws.nodes)
    };
  });

  const deleteGroup = (id) => {
    takeSnapshot();
    updateActiveWorkspace(ws => {
      const filteredGroups = ws.groups.filter(g => g.id !== id).map(g => g.parentGroupId === id ? { ...g, parentGroupId: null } : g);
      const updatedNodes = ws.nodes.map(n => n.groupId === id ? { ...n, groupId: null } : n);
      return {
        groups: computeLayout(filteredGroups, updatedNodes),
        nodes: updatedNodes
      };
    });
  };

  const updateNode = (id, updates) => updateActiveWorkspace(ws => {
    let updatedNodes = ws.nodes.map(n => n.id === id ? { ...n, ...updates } : n);
    
    // Clone propagation: if title or content changed, sync to all clones
    if (updates.title !== undefined || updates.content !== undefined) {
      const editedNode = updatedNodes.find(n => n.id === id);
      if (editedNode) {
        const syncFields = {};
        if (updates.title !== undefined) syncFields.title = updates.title;
        if (updates.content !== undefined) syncFields.content = updates.content;
        
        if (editedNode.cloneSourceId) {
          // Edited node is a clone: update all nodes with same cloneSourceId AND the source itself
          updatedNodes = updatedNodes.map(n => {
            if (n.id === id) return n; // already updated
            if (n.id === editedNode.cloneSourceId || n.cloneSourceId === editedNode.cloneSourceId) {
              return { ...n, ...syncFields };
            }
            return n;
          });
        } else {
          // Edited node is a source: update all nodes whose cloneSourceId matches this id
          updatedNodes = updatedNodes.map(n => {
            if (n.id === id) return n; // already updated
            if (n.cloneSourceId === id) {
              return { ...n, ...syncFields };
            }
            return n;
          });
        }
      }
    }
    
    return {
      nodes: updatedNodes,
      groups: computeLayout(ws.groups, updatedNodes)
    };
  });

  const processImage = (file, nodeId, compress) => {
    if (!compress) {
      if (file.size > 3 * 1024 * 1024) {
        setErrorMessage("Original image is too large (>3MB). Choose 'Compress' instead.");
        setPendingImageDrop(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        takeSnapshot();
        updateNode(nodeId, { image: event.target.result });
        setPendingImageDrop(null);
      };
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        const MAX_SIZE = 1024;
        if (width > height && width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        
        takeSnapshot();
        updateNode(nodeId, { image: compressedBase64 });
        setPendingImageDrop(null);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleImageDrop = (e, nodeId) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverNodeId(null);

    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setPendingImageDrop({ file, nodeId });
    }
  };


  const deleteNode = (id) => {
    takeSnapshot();
    updateActiveWorkspace(ws => {
      const filteredNodes = ws.nodes.filter(n => n.id !== id)
        .map(n => n.cloneSourceId === id ? { ...n, cloneSourceId: null } : n);
      return {
        nodes: filteredNodes,
        edges: ws.edges.filter(e => e.source !== id && e.target !== id),
        groups: computeLayout(ws.groups, filteredNodes)
      };
    });
  };

  const bringToFront = (id) => {
    updateActiveWorkspace(ws => {
      const idx = ws.nodes.findIndex(n => n.id === id);
      if (idx === -1) return ws;
      const newNodes = [...ws.nodes];
      const [node] = newNodes.splice(idx, 1);
      newNodes.push(node);
      return { nodes: newNodes };
    });
  };

  const sendToBack = (id) => {
    updateActiveWorkspace(ws => {
      const idx = ws.nodes.findIndex(n => n.id === id);
      if (idx === -1) return ws;
      const newNodes = [...ws.nodes];
      const [node] = newNodes.splice(idx, 1);
      newNodes.unshift(node);
      return { nodes: newNodes };
    });
  };

  const clearAllNodes = () => { takeSnapshot(); updateActiveWorkspace(() => ({ nodes: [], edges: [], groups: [] })); setShowConfirmClear(false); };
  const removeEdge = (edgeId) => { takeSnapshot(); updateActiveWorkspace(ws => ({ edges: ws.edges.filter(e => e.id !== edgeId) })); };

  const drawCurve = (x1, y1, x2, y2) => {
    const dx = Math.abs(x2 - x1);
    const offset = Math.max(dx * 0.5, 80); 
    return `M ${x1} ${y1} C ${x1 + offset} ${y1}, ${x2 - offset} ${y2}, ${x2} ${y2}`;
  };

  // --- Collision Overlap Disperser (Jitter) ---
  const disperseOverlappingNodes = () => {
    takeSnapshot();
    updateActiveWorkspace(ws => {
      const adjustedNodes = [...ws.nodes];
      let conflictResolved = false;

      for (let i = 0; i < adjustedNodes.length; i++) {
        for (let j = i + 1; j < adjustedNodes.length; j++) {
          const dx = adjustedNodes[i].x - adjustedNodes[j].x;
          const dy = adjustedNodes[i].y - adjustedNodes[j].y;
          const dist = Math.hypot(dx, dy);
          
          if (dist < 40) { 
            adjustedNodes[j] = {
              ...adjustedNodes[j],
              x: adjustedNodes[j].x + 60,
              y: adjustedNodes[j].y + 60
            };
            conflictResolved = true;
          }
        }
      }

      if (conflictResolved) {
        return {
          nodes: adjustedNodes,
          groups: computeLayout(ws.groups, adjustedNodes)
        };
      }
      return ws;
    });
  };


  // --- Collapse / Expand All Nodes ---
  const collapseAllNodes = () => {
    takeSnapshot();
    updateActiveWorkspace(ws => ({
      nodes: ws.nodes.map(n => ({ ...n, expanded: false })),
      groups: computeLayout(ws.groups, ws.nodes.map(n => ({ ...n, expanded: false })))
    }));
  };

  const expandAllNodes = () => {
    takeSnapshot();
    updateActiveWorkspace(ws => ({
      nodes: ws.nodes.map(n => ({ ...n, expanded: true })),
      groups: computeLayout(ws.groups, ws.nodes.map(n => ({ ...n, expanded: true })))
    }));
  };

  // --- Auto-Layout Engine ---
  const autoAlignWorkspace = () => {
    takeSnapshot();
    
    const resetGroups = groups.map(g => ({
      ...g,
      manualWidth: undefined,
      manualHeight: undefined
    }));

    const rootGroups = resetGroups.filter(g => !g.parentGroupId);
    let currentRootX = 100;

    const alignGroupContents = (groupId, startX, startY, updatedNodes, updatedGroups) => {
      let currentY = startY + 80;

      const groupNodes = updatedNodes.filter(n => n.groupId === groupId);
      const groupNodeIds = new Set(groupNodes.map(n => n.id));

      // Find edges that connect nodes within this group
      const intraGroupEdges = edges.filter(e => groupNodeIds.has(e.source) && groupNodeIds.has(e.target));

      // Separate connected vs unconnected nodes
      const connectedNodeIds = new Set();
      intraGroupEdges.forEach(e => {
        connectedNodeIds.add(e.source);
        connectedNodeIds.add(e.target);
      });

      const connectedNodes = groupNodes.filter(n => connectedNodeIds.has(n.id));
      const unconnectedNodes = groupNodes.filter(n => !connectedNodeIds.has(n.id));

      if (connectedNodes.length > 0) {
        // Build adjacency for topological sort (depth assignment)
        const inDegree = {};
        const adj = {};
        connectedNodes.forEach(n => { inDegree[n.id] = 0; adj[n.id] = []; });
        intraGroupEdges.forEach(e => {
          if (adj[e.source]) adj[e.source].push(e.target);
          if (inDegree[e.target] !== undefined) inDegree[e.target]++;
        });

        // Assign depth via BFS (Kahn's algorithm)
        const depth = {};
        const queue = [];
        connectedNodes.forEach(n => { if (inDegree[n.id] === 0) { queue.push(n.id); depth[n.id] = 0; } });
        let qi = 0;
        while (qi < queue.length) {
          const cur = queue[qi++];
          (adj[cur] || []).forEach(t => {
            inDegree[t]--;
            depth[t] = Math.max(depth[t] || 0, (depth[cur] || 0) + 1);
            if (inDegree[t] === 0) queue.push(t);
          });
        }
        // Handle cycles: assign remaining nodes to max depth + 1
        connectedNodes.forEach(n => { if (depth[n.id] === undefined) depth[n.id] = (Math.max(...Object.values(depth), 0)) + 1; });

        // Group nodes by column (depth)
        const columns = {};
        connectedNodes.forEach(n => {
          const d = depth[n.id] || 0;
          if (!columns[d]) columns[d] = [];
          columns[d].push(n);
        });

        const NODE_WIDTH = 340;
        const H_GAP = 80;
        const V_GAP = 30;
        const baseX = startX + 40;
        const baseY = currentY;
        let maxBottomY = baseY;

        const sortedDepths = Object.keys(columns).map(Number).sort((a, b) => a - b);
        const positionMap = {};

        sortedDepths.forEach((d, colIdx) => {
          const colX = baseX + colIdx * (NODE_WIDTH + H_GAP);
          let colY = baseY;
          columns[d].forEach(n => {
            positionMap[n.id] = { x: colX, y: colY };
            colY += (n.expanded ? 280 : 120) + V_GAP;
          });
          maxBottomY = Math.max(maxBottomY, colY);
        });

        updatedNodes = updatedNodes.map(n => {
          if (positionMap[n.id]) {
            return { ...n, x: positionMap[n.id].x, y: positionMap[n.id].y };
          }
          return n;
        });

        currentY = maxBottomY + 20;
      }

      // Stack unconnected nodes vertically below
      updatedNodes = updatedNodes.map(n => {
        if (n.groupId === groupId && !connectedNodeIds.has(n.id)) {
          const nodeX = startX + 40;
          const nodeY = currentY;
          currentY += (n.expanded ? 280 : 120) + 30;
          return { ...n, x: nodeX, y: nodeY };
        }
        return n;
      });

      updatedGroups = updatedGroups.map(sg => {
        if (sg.parentGroupId === groupId) {
          const sgX = startX + 40;
          const sgY = currentY;
          
          const res = alignGroupContents(sg.id, sgX, sgY, updatedNodes, updatedGroups);
          updatedNodes = res.nodes;
          updatedGroups = res.groups;

          const innerN = updatedNodes.filter(n => n.groupId === sg.id);
          const innerS = updatedGroups.filter(g => g.parentGroupId === sg.id);
          let maxChildY = sgY + 160;
          let maxChildX = sgX + 400;
          innerN.forEach(n => {
            maxChildY = Math.max(maxChildY, n.y + (n.expanded ? 280 : 120));
            maxChildX = Math.max(maxChildX, n.x + 340);
          });
          innerS.forEach(s => {
            maxChildY = Math.max(maxChildY, s.y + (s.height || 420));
            maxChildX = Math.max(maxChildX, s.x + (s.width || 440));
          });
          
          const computedWidth = Math.max(440, maxChildX - sgX + 40);
          currentY = maxChildY + 40;
          return { ...sg, x: sgX, y: sgY, width: computedWidth, height: Math.max(320, maxChildY - sgY + 20) };
        }
        return sg;
      });

      return { nodes: updatedNodes, groups: updatedGroups };
    };

    let workingNodes = [...nodes];
    let workingGroups = [...resetGroups];

    rootGroups.forEach((rg) => {
      const rgX = currentRootX;
      const rgY = 100;
      
      workingGroups = workingGroups.map(g => g.id === rg.id ? { ...g, x: rgX, y: rgY } : g);

      const res = alignGroupContents(rg.id, rgX, rgY, workingNodes, workingGroups);
      workingNodes = res.nodes;
      workingGroups = res.groups;

      // Compute actual width of this root group by examining all nodes and descendant subgroups
      const { descendantGroupIds, descendantNodeIds } = getDescendants(rg.id, workingGroups, workingNodes);
      const allGroupIds = [rg.id, ...descendantGroupIds];
      const allNodeIds = [...descendantNodeIds, ...workingNodes.filter(n => n.groupId === rg.id).map(n => n.id)];

      let maxX = rgX + 440;

      allNodeIds.forEach(nid => {
        const n = workingNodes.find(nd => nd.id === nid);
        if (n) {
          maxX = Math.max(maxX, n.x + 340);
        }
      });

      allGroupIds.forEach(gid => {
        const g = workingGroups.find(gr => gr.id === gid);
        if (g) {
          maxX = Math.max(maxX, g.x + (g.width || 440));
        }
      });

      currentRootX = maxX + 60;
    });

    const looseNodes = workingNodes.filter(n => !n.groupId);
    const looseX = currentRootX;
    let looseY = 100;

    workingNodes = workingNodes.map(node => {
      if (!node.groupId) {
        const nodeY = looseY;
        looseY += (node.expanded ? 280 : 120) + 40;
        return { ...node, x: looseX, y: nodeY };
      }
      return node;
    });

    const finalGroups = computeLayout(workingGroups, workingNodes);

    setWorkspaces(prev => prev.map(ws => ws.id === activeTab ? {
      ...ws,
      groups: finalGroups,
      nodes: workingNodes
    } : ws));
  };


  const renderLinks = (text) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return String(text).split(urlRegex).map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline cursor-pointer" onClick={(e) => e.stopPropagation()}>
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const NODE_WIDTH = 340;
  const HEADER_CENTER_Y = 24;

  const getConnectionPoint = (nodeId, isSource) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return null;

    let outermostCollapsedParent = null;
    let currParentId = node.groupId;
    while (currParentId) {
      const parentGroup = groups.find(g => g.id === currParentId);
      if (!parentGroup) break;
      if (!parentGroup.expanded) {
        outermostCollapsedParent = parentGroup;
      }
      currParentId = parentGroup.parentGroupId;
    }

    if (outermostCollapsedParent) {
      const pGroup = outermostCollapsedParent;
      const coords = getLiveCoordinates(pGroup, true);
      const gW = pGroup.width || 440;

      return {
        x: isSource ? coords.x + gW : coords.x,
        y: coords.y + 24
      };
    }

    const coords = getLiveCoordinates(node, false);
    return {
      x: isSource ? coords.x + NODE_WIDTH : coords.x,
      y: coords.y + HEADER_CENTER_Y
    };
  };

  const getTaskStats = () => {
    const total = nodes.length;
    const completed = nodes.filter(n => n.status === 'Done').length;
    const inProgress = nodes.filter(n => n.status === 'In Progress').length;
    const todo = nodes.filter(n => n.status === 'Todo').length;
    const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, inProgress, todo, progressPercent };
  };

  const stats = getTaskStats();

  if (!initialized || !activeWs) return null;


  // --- Outline Board Content ---
  const renderOutlineCard = (node) => {
    const nTheme = THEMES[node.theme] || THEMES.amber;
    const isExpanded = expandedOutlineCards[node.id];
    return (
      <div key={node.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-200">
        <div className={`flex items-center gap-2 px-3 py-2.5 border-b ${isExpanded ? 'border-slate-100' : 'border-transparent'}`}>
          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${nTheme.port}`} />
          <span className="flex-1 text-xs font-semibold text-slate-700 truncate">{node.title || `Task #${node.id}`}</span>
          <div className="flex items-center gap-1 shrink-0">
            {node.nodeType !== 'concept' && <button onClick={() => { takeSnapshot(); updateNode(node.id, { priority: node.priority === 'High' ? 'Medium' : node.priority === 'Medium' ? 'Low' : 'High' }); }} className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase border transition-all cursor-pointer hover:opacity-80 ${node.priority === 'High' ? 'bg-red-50 text-red-700 border-red-200' : node.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`} title="Tap to cycle priority">{node.priority}</button>}
            {node.nodeType !== 'concept' && <button onClick={() => { takeSnapshot(); const statuses = ['Todo', 'In Progress', 'Done', 'Milestone']; const idx = statuses.indexOf(node.status); updateNode(node.id, { status: statuses[(idx + 1) % statuses.length] }); }} className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase border transition-all cursor-pointer hover:opacity-80 ${node.status === 'Done' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : node.status === 'In Progress' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : node.status === 'Milestone' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`} title="Tap to cycle status">{node.status}</button>}
            <button onClick={() => setExpandedOutlineCards(prev => ({...prev, [node.id]: !prev[node.id]}))} className="p-1 hover:bg-slate-100 rounded-md text-slate-400">
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <button onClick={() => deleteNode(node.id)} className="p-1 hover:bg-red-50 hover:text-red-500 text-slate-300 rounded-md transition-colors"><X className="w-3.5 h-3.5" /></button>
          </div>
        </div>
        {isExpanded && (
          <div className="p-3 space-y-2 bg-slate-50/50">
            <textarea
              className="w-full text-xs text-slate-600 bg-white border border-slate-200 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 leading-relaxed min-h-[64px]"
              placeholder="Write notes, requirements, or links..."
              value={node.content || ''}
              onFocus={() => takeSnapshot()}
              onChange={(e) => updateNode(node.id, { content: e.target.value })}
            />
            {node.image ? (
              <div className="relative group rounded-lg overflow-hidden border border-slate-200">
                <img src={node.image} alt="attachment" className="max-h-32 w-full object-cover" />
                <button onClick={() => { takeSnapshot(); updateNode(node.id, { image: null }); }} className="absolute top-1.5 right-1.5 p-1 bg-white/90 hover:bg-red-50 hover:text-red-500 text-slate-400 rounded shadow text-xs transition-colors opacity-0 group-hover:opacity-100"><X className="w-3 h-3" /></button>
              </div>
            ) : (
              <label className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors">
                <ImageIcon className="w-3.5 h-3.5" /><span>Upload image</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if(f) setPendingImageDrop({file:f, nodeId: node.id}); e.target.value=null; }} />
              </label>
            )}
          </div>
        )}
      </div>
    );
  };


  const outlineBoardContent = (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 space-y-3">
      {groups.filter(g => !g.parentGroupId).map(group => {
        const theme = THEMES[group.theme] || THEMES.amber;
        const childNodes = nodes.filter(n => n.groupId === group.id);
        const childSubgroups = groups.filter(g2 => g2.parentGroupId === group.id);
        const totalChildren = childNodes.length + childSubgroups.length;
        return (
          <div key={group.id} className={`rounded-2xl border-2 border-dashed overflow-hidden ${theme.groupBg}`}>
            <div className={`relative flex items-center gap-2 px-4 py-3 ${theme.groupHeader} border-b`}>
              <button onClick={() => updateGroup(group.id, { expanded: !group.expanded })} className="shrink-0 p-0.5 hover:bg-white/50 rounded-md transition-colors">
                {group.expanded ? <ChevronDown className={`w-4 h-4 ${theme.text}`} /> : <ChevronRight className={`w-4 h-4 ${theme.text}`} />}
              </button>
              <div className={`w-3 h-3 rounded-full shrink-0 ${theme.port}`} />
              <input className={`bg-transparent font-bold focus:bg-white/60 focus:outline-none rounded px-1 py-0.5 text-xs tracking-wide uppercase flex-1 min-w-0 ${theme.text}`} value={group.name || ''} onChange={(e) => updateGroup(group.id, { name: e.target.value })} />
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/60 border ${theme.tag}`}>{totalChildren} items</span>
              <button onClick={(e) => { e.stopPropagation(); setOpenColorPicker(openColorPicker === `ob-${group.id}` ? null : `ob-${group.id}`); }} className={`p-1.5 hover:bg-white/50 rounded-md transition-colors ${theme.text}`} title="Change theme"><Palette className="w-3.5 h-3.5" /></button>
              {openColorPicker === `ob-${group.id}` && (
                <div className="absolute top-12 right-16 bg-white p-2 rounded-xl shadow-xl border border-slate-100 flex gap-1.5 z-50" onClick={(e) => e.stopPropagation()}>
                  {Object.keys(THEMES).map(colorKey => (
                    <button key={colorKey} onClick={() => { takeSnapshot(); updateGroup(group.id, { theme: colorKey }); setOpenColorPicker(null); }} className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-transform hover:scale-110 ${THEMES[colorKey].port}`}>{group.theme === colorKey && <Check className="w-3 h-3 text-white" />}</button>
                  ))}
                </div>
              )}
              <button onClick={() => addNode(undefined, undefined, group.id)} className={`p-1.5 hover:bg-white/50 rounded-md transition-colors ${theme.text}`} title="Add card"><Plus className="w-3.5 h-3.5" /></button>
              <button onClick={() => deleteGroup(group.id)} className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-md transition-colors"><X className="w-3.5 h-3.5" /></button>
            </div>
            {group.expanded && (
              <div className="p-3 space-y-2">
                {childNodes.map(node => renderOutlineCard(node))}
                {childSubgroups.map(sub => {
                  const subTheme = THEMES[sub.theme] || THEMES.blue;
                  const subNodes = nodes.filter(n => n.groupId === sub.id);
                  return (
                    <div key={sub.id} className={`rounded-xl border-2 border-dashed ml-3 overflow-hidden ${subTheme.groupBg}`}>
                      <div className={`flex items-center gap-2 px-3 py-2.5 ${subTheme.groupHeader} border-b`}>
                        <button onClick={() => updateGroup(sub.id, { expanded: !sub.expanded })} className="shrink-0 p-0.5 hover:bg-white/50 rounded-md">
                          {sub.expanded ? <ChevronDown className={`w-3.5 h-3.5 ${subTheme.text}`} /> : <ChevronRight className={`w-3.5 h-3.5 ${subTheme.text}`} />}
                        </button>
                        <span className={`text-[8px] font-bold uppercase tracking-wider ${subTheme.text} opacity-60`}>SUB</span>
                        <input className={`bg-transparent font-bold focus:bg-white/60 focus:outline-none rounded px-1 py-0.5 text-xs tracking-wide uppercase flex-1 min-w-0 ${subTheme.text}`} value={sub.name || ''} onChange={(e) => updateGroup(sub.id, { name: e.target.value })} />
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/60 border ${subTheme.tag}`}>{subNodes.length}</span>
                        <button onClick={() => addNode(undefined, undefined, sub.id)} className={`p-1 hover:bg-white/50 rounded-md ${subTheme.text}`}><Plus className="w-3 h-3" /></button>
                        <button onClick={() => deleteGroup(sub.id)} className="p-1 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-md"><X className="w-3 h-3" /></button>
                      </div>
                      {sub.expanded && (
                        <div className="p-2 space-y-1.5">
                          {subNodes.map(n => renderOutlineCard(n))}
                          {subNodes.length === 0 && <p className="text-[10px] italic text-slate-400 py-2 text-center">No cards in this subgroup</p>}
                        </div>
                      )}
                    </div>
                  );
                })}
                {childNodes.length === 0 && childSubgroups.length === 0 && (
                  <button onClick={() => addNode(undefined, undefined, group.id)} className="w-full py-3 text-xs font-semibold text-slate-400 hover:text-indigo-600 hover:bg-white/50 rounded-xl border border-dashed border-slate-300 hover:border-indigo-300 transition-all flex items-center justify-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Add first card
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}


      {nodes.filter(n => !n.groupId).length > 0 && (
        <div className="rounded-2xl border-2 border-dashed border-slate-300/60 bg-white/40 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-100/60 border-b border-slate-200">
            <FileText className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex-1">Unassigned Cards</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-500">{nodes.filter(n => !n.groupId).length} items</span>
          </div>
          <div className="p-3 space-y-2">
            {nodes.filter(n => !n.groupId).map(node => renderOutlineCard(node))}
          </div>
        </div>
      )}

      {groups.length === 0 && nodes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <LayoutList className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-slate-500 font-semibold text-sm mb-1">No backlog items yet</p>
          <p className="text-slate-400 text-xs mb-6">Switch to Canvas view or add cards here</p>
          <button onClick={() => addNode()} className="flex items-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow transition-all">
            <Plus className="w-4 h-4 mr-1.5" /> Add First Card
          </button>
        </div>
      )}
    </div>
  );

  if (passwordEnabled && !isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 w-full max-w-sm mx-4">
          <div className="flex flex-col items-center mb-6">
            <div className="p-3 bg-indigo-50 rounded-xl mb-3">
              <Shield className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Password Required</h2>
            <p className="text-sm text-slate-500 mt-1">Enter your password to access the app</p>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (passwordInput === storedPassword) {
              setIsAuthenticated(true);
              setPasswordInput('');
              setPasswordError('');
            } else {
              setPasswordError('Incorrect password. Please try again.');
            }
          }}>
            <div className="relative mb-3">
              <input
                type={showGatePassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowGatePassword(!showGatePassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showGatePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordError && (
              <p className="text-xs text-red-500 mb-3">{passwordError}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md transition-colors"
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#f8fafc] font-sans text-slate-800 selection:bg-indigo-100 overflow-hidden">
      
      {/* --- Top Command Toolbar --- */}
      <header className="h-14 sm:h-16 bg-white border-b border-slate-200/80 flex items-center px-2 sm:px-4 md:px-6 shadow-sm z-50 justify-between shrink-0 gap-1 sm:gap-2">
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
          <button 
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors shrink-0"
            title={showSidebar ? "Hide Dashboard" : "Show Dashboard"}
          >
            {showSidebar ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
          </button>
          
          <div className="p-2 sm:p-2.5 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-lg sm:rounded-xl text-white shadow-md shadow-indigo-100 shrink-0">
            <Network className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          {/* Workspace Dropdown Selector */}
          <div className="relative min-w-0 flex-1 max-w-[200px] sm:max-w-[240px] md:max-w-[300px]">
            <button
              onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-slate-50 border border-slate-200 transition-colors w-full"
            >
              <span className="text-xs sm:text-sm font-semibold text-slate-700 truncate flex-1 text-left">
                {activeWs?.name || 'Select Workspace'}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 transition-transform shrink-0 ${showWorkspaceDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showWorkspaceDropdown && (
              <>
                <div className="fixed inset-0 z-[99]" onClick={() => setShowWorkspaceDropdown(false)}></div>
                <div className="absolute top-full left-0 mt-2 w-56 sm:w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-[100] max-w-[calc(100vw-2rem)]">
                  {workspaces.map(ws => (
                    <button
                      key={ws.id}
                      onClick={() => { setActiveTab(ws.id); setShowWorkspaceDropdown(false); }}
                      className={`w-full flex items-center px-4 py-2.5 text-sm font-medium transition-colors ${
                        activeTab === ws.id 
                          ? 'bg-indigo-50 text-indigo-700' 
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <FolderOpen className={`w-4 h-4 mr-2.5 shrink-0 ${activeTab === ws.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span className="truncate">{ws.name}</span>
                      {activeTab === ws.id && <Check className="w-4 h-4 ml-auto text-indigo-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>


        <div className="relative flex items-center gap-0.5 sm:gap-1 shrink-0">
          {/* Always-visible Undo/Redo buttons */}
          <button onClick={performUndo} disabled={!canUndo} className={`p-1.5 sm:p-2 rounded-lg transition-colors ${!canUndo ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'}`} title="Undo">
            <Undo2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button onClick={performRedo} disabled={!canRedo} className={`p-1.5 sm:p-2 rounded-lg transition-colors ${!canRedo ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'}`} title="Redo">
            <Redo2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="w-px h-5 sm:h-6 bg-slate-200 mx-0.5 sm:mx-1"></div>

          <input type="file" accept=".json" ref={fileInputRef} onChange={handleImport} className="hidden" />
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
            title="More actions"
          >
            <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {showMoreMenu && (
            <>
            <div className="fixed inset-0 z-[99]" onClick={() => setShowMoreMenu(false)}></div>
            <div className="absolute top-full right-0 mt-2 w-52 sm:w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-[100] max-w-[calc(100vw-1rem)]">
              <button onClick={() => { disperseOverlappingNodes(); setShowMoreMenu(false); }} className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <RefreshCw className="w-4 h-4 mr-2.5 text-indigo-500" /> Disperse Overlaps
              </button>
              <button onClick={() => { autoAlignWorkspace(); setShowMoreMenu(false); }} className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <Sparkles className="w-4 h-4 mr-2.5 text-indigo-600" /> Auto-Align Canvas
              </button>
              <button onClick={() => { collapseAllNodes(); setShowMoreMenu(false); }} className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <Minimize2 className="w-4 h-4 mr-2.5 text-amber-600" /> Collapse All Nodes
              </button>
              <button onClick={() => { expandAllNodes(); setShowMoreMenu(false); }} className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <Maximize2 className="w-4 h-4 mr-2.5 text-emerald-600" /> Expand All Nodes
              </button>
              <div className="h-px bg-slate-100 my-1 mx-3"></div>
              <button onClick={() => { createGroup(); setShowMoreMenu(false); }} className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-indigo-700 hover:bg-indigo-50 transition-colors">
                <Layers className="w-4 h-4 mr-2.5" /> New Group
              </button>
              <button onClick={() => { addNode(undefined, undefined, null, 'task'); setShowMoreMenu(false); }} className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-indigo-700 hover:bg-indigo-50 transition-colors">
                <Plus className="w-4 h-4 mr-2.5" /> Add Task Node
              </button>
              <button onClick={() => { addNode(undefined, undefined, null, 'concept'); setShowMoreMenu(false); }} className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-violet-700 hover:bg-violet-50 transition-colors">
                <Sparkles className="w-4 h-4 mr-2.5" /> Add Concept Node
              </button>
            </div>
            </>
          )}
        </div>
      </header>


      {/* --- Workspace Panel Layout --- */}
      <div className="flex-1 flex overflow-hidden w-full relative">
        
        {/* --- Left Sidebar Overlay backdrop (mobile only) --- */}
        {showSidebar && (
          <div 
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* --- Left Sidebar --- */}
        {showSidebar && (
          <aside className="w-[calc(100vw-3rem)] max-w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 z-40 animate-in slide-in-from-left duration-200 fixed md:relative inset-y-0 left-0 top-14 sm:top-16 md:top-0 shadow-xl md:shadow-none overflow-y-auto">
            <div className="p-4 border-b border-slate-100">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <button onClick={() => fileInputRef.current?.click()} className="flex-1 flex items-center justify-center px-3 py-2 hover:bg-slate-100 text-slate-600 text-sm font-medium rounded-lg border border-slate-200 transition-colors" title="Import Map JSON">
                    <Upload className="w-4 h-4 mr-1.5" /> Import
                  </button>
                  <button onClick={exportData} className="flex-1 flex items-center justify-center px-3 py-2 hover:bg-slate-100 text-slate-600 text-sm font-medium rounded-lg border border-slate-200 transition-colors" title="Export Map JSON">
                    <Download className="w-4 h-4 mr-1.5" /> Export
                  </button>
                </div>
                <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-0.5">
                  <button
                    onClick={() => setViewMode('canvas')}
                    title="Canvas View"
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'canvas' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <MonitorSpeaker className="w-3.5 h-3.5" /> Canvas
                  </button>
                  <button
                    onClick={() => setViewMode('outline')}
                    title="Outline Board View"
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'outline' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <LayoutList className="w-3.5 h-3.5" /> Outline
                  </button>
                </div>
                <button
                  onClick={() => setShowClonePanel(!showClonePanel)}
                  title="Show Clone Nodes"
                  className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all mt-1.5 w-full ${showClonePanel ? 'bg-violet-100 text-violet-700 border border-violet-300' : 'bg-slate-100 text-slate-500 hover:text-slate-700 hover:bg-slate-200'}`}
                >
                  <Copy className="w-3.5 h-3.5" /> Show Clone Nodes
                </button>
              </div>
            </div>

            <div className="p-4 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 tracking-wider uppercase block mb-3">Mind Map Workspaces</span>
              <div className="flex flex-col gap-1 max-h-36 overflow-y-auto custom-scrollbar pr-1">
                {workspaces.map(ws => (
                  <div 
                    key={ws.id} 
                    onClick={() => setActiveTab(ws.id)}
                    className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      activeTab === ws.id ? 'bg-indigo-50/80 text-indigo-900 font-semibold' : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FolderOpen className={`w-4 h-4 shrink-0 ${activeTab === ws.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                      {editingTab === ws.id ? (
                        <input autoFocus className="bg-transparent border-none outline-none w-full text-sm font-semibold" defaultValue={ws.name} onBlur={(e) => renameWorkspace(ws.id, e.target.value || 'Untitled')} onKeyDown={(e) => e.key === 'Enter' && renameWorkspace(ws.id, e.currentTarget.value || 'Untitled')} />
                      ) : (
                        <span className="text-sm truncate" onDoubleClick={() => { takeSnapshot(); setEditingTab(ws.id); }}>{ws.name}</span>
                      )}
                    </div>
                    {workspaces.length > 1 && (
                      <button onClick={(e) => deleteWorkspace(ws.id, e)} className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-slate-200">
                        <X className="w-3.5 h-3.5 text-slate-400 hover:text-red-500" />
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={addWorkspace} className="flex items-center justify-center p-2 rounded-lg border border-dashed border-slate-200 hover:border-indigo-300 text-xs font-semibold text-indigo-600 hover:bg-indigo-50/50 transition-all mt-1">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add New Workspace
                </button>
              </div>
            </div>


            <div className="p-4 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 tracking-wider uppercase block mb-3">Task Completion Stats</span>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-500">Progress</span>
                  <span className="text-sm font-bold text-indigo-600">{stats.progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-2 rounded-full transition-all duration-500" style={{ width: `${stats.progressPercent}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-800">{stats.completed}</div>
                    <div className="text-slate-400 font-medium">Completed</div>
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-800">{stats.inProgress}</div>
                    <div className="text-slate-400 font-medium">In Progress</div>
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-500 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-800">{stats.todo}</div>
                    <div className="text-slate-400 font-medium">Todo Items</div>
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-purple-500 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-800">{stats.total}</div>
                    <div className="text-slate-400 font-medium">Total Tasks</div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Password Protection Section --- */}
            <div className="p-4 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 tracking-wider uppercase block mb-3">Password Protection</span>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-semibold text-slate-700">Enable Protection</span>
                  </div>
                  <button
                    onClick={() => {
                      if (passwordEnabled) {
                        setPasswordEnabled(false);
                        setIsAuthenticated(false);
                      } else {
                        if (storedPassword) {
                          setPasswordEnabled(true);
                        } else {
                          setShowPasswordInput(true);
                        }
                      }
                    }}
                    className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${passwordEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${passwordEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
                {(showPasswordInput || (passwordEnabled && storedPassword)) && (
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <label className="text-xs font-medium text-slate-500">
                      {storedPassword ? 'Change Password' : 'Set Password'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        placeholder={storedPassword ? 'New password' : 'Enter password'}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => {
                          if (newPasswordInput.trim()) {
                            setStoredPassword(newPasswordInput.trim());
                            setNewPasswordInput('');
                            if (!passwordEnabled) {
                              setPasswordEnabled(true);
                            }
                            setShowPasswordInput(false);
                          }
                        }}
                        className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>


            <div className="p-4 flex-1 flex flex-col min-h-0">
              <span className="text-xs font-bold text-slate-400 tracking-wider uppercase block mb-3">Nodes Directory Explorer</span>
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5 pr-1">
                {nodes.length === 0 ? (
                  <div className="text-xs italic text-slate-400 py-4 text-center">No nodes created yet</div>
                ) : (
                  nodes.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => {
                        bringToFront(n.id);
                        setFocusedNodeId(n.id);
                        
                        const rect = workspaceRef.current.getBoundingClientRect();
                        const centerX = rect.width / 2;
                        const centerY = rect.height / 2;
                        
                        setTransform({
                          x: centerX - n.x * transform.scale - (NODE_WIDTH * transform.scale) / 2,
                          y: centerY - n.y * transform.scale - (140 * transform.scale) / 2,
                          scale: transform.scale
                        });
                        
                        setTimeout(() => {
                          setFocusedNodeId(prev => prev === n.id ? null : prev);
                        }, 4000);
                      }}
                      className={`p-2 border rounded-lg cursor-pointer transition-all flex items-center justify-between text-xs font-semibold ${
                        focusedNodeId === n.id 
                          ? 'bg-indigo-50 border-indigo-400 text-indigo-900 shadow-md ring-2 ring-indigo-500/20' 
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-100 hover:border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <div className={`w-2.5 h-2.5 rounded-full ${THEMES[n.theme]?.port || 'bg-amber-400'}`} />
                        <span className="truncate">{n.title || `Task Node #${n.id}`}</span>
                      </div>
                      <span className="text-[10px] bg-slate-200/80 px-1.5 py-0.5 rounded text-slate-500 uppercase shrink-0 font-bold tracking-wide">
                        {n.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
        )}


        {/* --- Main Workspace Canvas Area --- */}
        <main
          ref={workspaceRef}
          className={`${showClonePanel ? 'flex-1 min-w-0' : 'flex-1'} relative overflow-hidden ${showClonePanel ? 'bg-[#1a1a2e]' : 'bg-[#1e1e2e]'} touch-none text-slate-800 transition-all duration-300`}
          onPointerDown={handlePointerDownMain}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onWheel={handleWheel}
          onContextMenu={handleContextMenu}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ display: viewMode === 'canvas' ? undefined : 'none' }}
        >
          {/* Panning grid backdrop */}
          <div className="absolute inset-0 canvas-grid-clickable cursor-crosshair active:cursor-grabbing opacity-60" style={{
            backgroundImage: 'radial-gradient(#4a5568 1.5px, transparent 1.5px)',
            backgroundSize: `${24 * transform.scale}px ${24 * transform.scale}px`,
            backgroundPosition: `${transform.x}px ${transform.y}px`
          }} />

          {/* Canvas View Transform Layer */}
          <div 
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`, transformOrigin: '0 0' }}
          >
            
            {/* --- Render Phase Groups and Nested Subgroups --- */}
            {groups.map(group => {
              if (group.parentGroupId) {
                if (isGroupHidden(group.parentGroupId, groups)) return null;
              }

              const theme = THEMES[group.theme] || THEMES.amber;
              const isGrpDragging = draggingGroup?.id === group.id;
              
              const coords = getLiveCoordinates(group, true);
              const displayX = coords.x;
              const displayY = coords.y;
              const displayW = group.width || 440;
              const displayH = group.height || 420;

              const innerNodes = nodes.filter(n => n.groupId === group.id);
              const innerSubgroups = groups.filter(g => g.parentGroupId === group.id);
              const isTargetHover = dragHoveredGroupId === group.id;

              return (
                <div
                  key={group.id}
                  className={`absolute rounded-2xl border-2 pointer-events-auto transition-shadow duration-150 ${theme.groupBg} ${
                    isGrpDragging ? 'shadow-2xl border-indigo-500 z-20' : 'border-slate-300/60 z-0'
                  } ${isTargetHover ? 'ring-4 ring-indigo-500/30 border-indigo-500 border-solid bg-indigo-50/10' : 'border-dashed'} ${
                    group.parentGroupId ? 'border-indigo-400/50 scale-[0.98] shadow-inner' : ''
                  }`}
                  style={{ 
                    left: displayX, 
                    top: displayY, 
                    width: displayW,
                    height: group.expanded ? displayH : 64
                  }}
                >


                  {/* Figma-Style Header Control */}
                  <div 
                    className={`flex items-center justify-between px-4 h-12 rounded-t-xl border-b cursor-grab active:cursor-grabbing select-none ${theme.groupHeader}`}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      if (e.target.tagName === 'INPUT' || e.target.closest('button')) return;
                      setFocusedGroupId(group.id);
                      setFocusedNodeId(null);
                      dragSnapshot.current = JSON.parse(JSON.stringify(stateRef.current));
                      setDraggingGroup({
                        id: group.id,
                        startX: e.clientX,
                        startY: e.clientY,
                        initialX: group.x,
                        initialY: group.y,
                        currentX: group.x,
                        currentY: group.y,
                        width: group.width || 440,
                        height: group.height || 420
                      });
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const rect = workspaceRef.current.getBoundingClientRect();
                      setGroupContextMenu({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                        groupId: group.id
                      });
                      setContextMenu(null);
                      setNodeContextMenu(null);
                    }}
                  >
                    <div className="flex items-center gap-2 flex-1 overflow-hidden">
                      <Move className="w-3.5 h-3.5 shrink-0 opacity-50 text-slate-500" />
                      <div className="flex flex-col flex-1 overflow-hidden">
                        {group.parentGroupId && (
                          <span className="text-[8px] font-bold text-indigo-500 uppercase tracking-wider block -mb-0.5">
                            Subgroup under {groups.find(parent => parent.id === group.parentGroupId)?.name || 'Parent'}
                          </span>
                        )}
                        <input 
                          className={`bg-transparent font-bold focus:bg-white/50 focus:outline-none rounded px-1.5 py-0.5 text-xs tracking-wide uppercase w-full ${theme.text}`}
                          value={group.name || ''}
                          onChange={(e) => updateGroup(group.id, { name: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 shrink-0">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setOpenColorPicker(openColorPicker === group.id ? null : group.id); }}
                        className={`p-1.5 hover:bg-white/50 rounded-md transition-colors ${theme.text}`}
                        title="Group Color"
                      >
                        <Palette className="w-3.5 h-3.5" />
                      </button>
                      {openColorPicker === group.id && (
                        <div className="absolute top-11 right-12 bg-white p-2 rounded-xl shadow-xl border border-slate-100 flex gap-1.5 z-50 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                          {Object.keys(THEMES).map(colorKey => (
                            <button key={colorKey} onClick={() => { takeSnapshot(); updateGroup(group.id, { theme: colorKey }); setOpenColorPicker(null); }} className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-transform hover:scale-110 ${THEMES[colorKey].port}`}>
                              {group.theme === colorKey && <Check className="w-3 h-3 text-white" />}
                            </button>
                          ))}
                        </div>
                      )}

                      <button 
                        onClick={(e) => { e.stopPropagation(); addNode(undefined, undefined, group.id); }}
                        className={`p-1.5 hover:bg-white/50 rounded-md transition-colors ${theme.text}`}
                        title="Add Card inside Section"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>

                      <button onClick={() => updateGroup(group.id, { expanded: !group.expanded })} className={`p-1.5 hover:bg-white/50 rounded-md transition-colors ${theme.text}`}>
                        {group.expanded ? <ChevronDown className="w-3.5 h-3.5"/> : <ChevronRight className="w-3.5 h-3.5"/>}
                      </button>
                      <button onClick={() => deleteGroup(group.id)} className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-md transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>


                  {!group.expanded && (
                    <div className="p-3 text-[10px] font-bold text-slate-500 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-500" /> {innerNodes.length + innerSubgroups.length} items minimized
                    </div>
                  )}

                  {group.expanded && (
                    <div 
                      className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize flex items-end justify-end p-0.5 z-30 pointer-events-auto"
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        dragSnapshot.current = JSON.parse(JSON.stringify(stateRef.current));
                        setResizingGroup({
                          id: group.id,
                          startX: e.clientX,
                          startY: e.clientY,
                          initialWidth: group.width || 440,
                          initialHeight: group.height || 420
                        });
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" className="text-slate-400/80 hover:text-indigo-600 transition-colors">
                        <path d="M12,0 L0,12 M12,4 L4,12 M12,8 L8,12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}

            {/* --- Connecting Dynamic Paths --- */}
            <svg className="absolute overflow-visible w-full h-full z-30">
              <defs>
                {Object.entries(THEMES).map(([key, theme]) => (
                  <marker key={key} id={`arrow-${key}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <polygon points="0 0, 6 3, 0 6" fill={theme.line} />
                  </marker>
                ))}
              </defs>
              
              {edges.map(edge => {
                const startPos = getConnectionPoint(edge.source, true);
                const endPos = getConnectionPoint(edge.target, false);
                
                if (!startPos || !endPos) return null;

                const sourceNode = nodes.find(n => n.id === edge.source);
                const targetNode = nodes.find(n => n.id === edge.target);

                if (sourceNode && targetNode) {
                  if (shareCollapsedAncestor(sourceNode, targetNode, groups)) return null;
                }

                const sourceTheme = sourceNode ? (THEMES[sourceNode.theme] || THEMES.amber) : THEMES.amber;

                return (
                  <g key={edge.id} className="cursor-pointer group animate-in fade-in" onClick={(e) => { e.stopPropagation(); removeEdge(edge.id); }} style={{ pointerEvents: 'auto' }} title="Click connection to remove">
                    <path d={drawCurve(startPos.x, startPos.y, endPos.x, endPos.y)} stroke="transparent" strokeWidth={24} fill="none" />
                    <path d={drawCurve(startPos.x, startPos.y, endPos.x, endPos.y)} stroke={sourceTheme.line} strokeWidth={3} fill="none" markerEnd={`url(#arrow-${sourceNode?.theme || 'amber'})`} className="transition-all duration-300 group-hover:stroke-red-500 group-hover:stroke-[4px]" />
                  </g>
                );
              })}
              
              {connecting && (
                <path d={drawCurve(connecting.startX, connecting.startY, connecting.currentX, connecting.currentY)} stroke={THEMES[nodes.find(n => n.id === connecting.sourceId)?.theme || 'amber'].line} strokeWidth={3} strokeDasharray="8,6" fill="none" className="animate-[dash_1s_linear_infinite]" />
              )}
            </svg>


            {/* --- Nodes Layer --- */}
            {nodes.map((node, index) => {
              if (node.groupId) {
                if (isGroupHidden(node.groupId, groups)) return null;
              }

              const theme = THEMES[node.theme] || THEMES.amber;
              const isDragging = draggingNode?.id === node.id;
              
              const coords = getLiveCoordinates(node, false);
              const displayX = coords.x;
              const displayY = coords.y;

              const isFocused = focusedNodeId === node.id;

              return (
                <div
                  key={node.id}
                  className={`absolute rounded-xl border w-[${NODE_WIDTH}px] flex flex-col pointer-events-auto bg-white/95 backdrop-blur-sm ${theme.wrapper} ${
                    isDragging ? 'shadow-2xl scale-[1.03] ring-2 ring-indigo-500' : 'transition-all duration-150 shadow-md'
                  } ${dragOverNodeId === node.id ? 'ring-4 ring-indigo-400 ring-opacity-50 scale-[1.02]' : ''} ${
                    isFocused ? 'ring-4 ring-indigo-500 animate-[pulse_1.5s_infinite]' : ''
                  }`}
                  style={{ 
                    left: displayX, 
                    top: displayY, 
                    width: NODE_WIDTH,
                    zIndex: isDragging ? 9999 : (isFocused ? 999 : 50 + index) 
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const rect = workspaceRef.current.getBoundingClientRect();
                    setNodeContextMenu({
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                      nodeId: node.id
                    });
                    setContextMenu(null);
                  }}
                  onDragOver={(e) => { e.preventDefault(); setDragOverNodeId(node.id); }}
                  onDragLeave={(e) => { e.preventDefault(); setDragOverNodeId(null); }}
                  onDrop={(e) => handleImageDrop(e, node.id)}
                >
                  <div className="absolute -top-3.5 left-5 flex items-center gap-1.5 z-20">
                    <div className={`px-3 py-0.5 rounded-full text-[10px] font-bold shadow-sm border flex items-center gap-1.5 ${theme.tag}`}>
                      {(node.nodeType === 'concept') ? <><Sparkles className="w-3.5 h-3.5" /> CONCEPT {node.id}</> : <><FileText className="w-3.5 h-3.5" /> TASK {node.id}</>}
                    </div>
                    {node.cloneSourceId && (
                      <div className="px-2 py-0.5 rounded-full text-[9px] font-bold shadow-sm border flex items-center gap-1 bg-violet-100 text-violet-700 border-violet-300">
                        <Copy className="w-3 h-3" /> CLONE
                      </div>
                    )}
                  </div>

                  {node.nodeType !== 'concept' && (
                  <div className="absolute -top-3.5 right-5 flex items-center gap-1 z-20">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase border ${
                      node.priority === 'High' ? 'bg-red-50 text-red-700 border-red-200' :
                      node.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      {node.priority}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase border ${
                      node.status === 'Done' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      node.status === 'In Progress' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {node.status}
                    </span>
                  </div>
                  )}


                  {/* Drag Handle Header */}
                  <div
                    className={`flex items-center justify-between px-3 h-12 rounded-t-xl border-b cursor-grab active:cursor-grabbing select-none relative ${theme.header}`}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      if (e.target.tagName === 'INPUT' || e.target.closest('button') || e.target.closest('select')) return;
                      nodeTapRef.current = { id: node.id, startX: e.clientX, startY: e.clientY, time: Date.now(), pointerType: e.pointerType };
                      dragSnapshot.current = JSON.parse(JSON.stringify(stateRef.current));
                      bringToFront(node.id);
                      setDraggingNode({ 
                        id: node.id, 
                        startX: e.clientX, 
                        startY: e.clientY, 
                        initialX: node.x, 
                        initialY: node.y,
                        currentX: node.x,
                        currentY: node.y
                      });
                    }}
                    onPointerUp={(e) => {
                      if (nodeTapRef.current && nodeTapRef.current.id === node.id && nodeTapRef.current.pointerType === 'touch') {
                        const elapsed = Date.now() - nodeTapRef.current.time;
                        const moved = Math.hypot(e.clientX - nodeTapRef.current.startX, e.clientY - nodeTapRef.current.startY);
                        if (elapsed < 350 && moved < 10) {
                          setMobileSheet(node.id);
                        }
                      }
                      nodeTapRef.current = null;
                    }}
                  >
                    <div className="flex items-center gap-2 flex-1 overflow-hidden pl-2 mt-1">
                      <GripHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <input className="bg-transparent font-bold focus:outline-none focus:bg-white/80 rounded px-1.5 w-full text-xs text-slate-800 placeholder-slate-400" value={node.title || ''} placeholder="Enter Title..." onFocus={() => takeSnapshot()} onChange={(e) => updateNode(node.id, { title: e.target.value })} />
                    </div>
                    
                    <div className="flex items-center gap-0.5 shrink-0 ml-1 mt-1 relative">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setOpenLinkPicker(openLinkPicker === node.id ? null : node.id); setOpenColorPicker(null); }}
                        className={`p-1 hover:bg-white/50 rounded text-slate-500 ${node.linkToTab ? 'text-indigo-600 font-bold' : ''}`}
                        title="Link Portal to Tab"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                      </button>
                      {openLinkPicker === node.id && (
                        <div className="absolute top-10 right-0 bg-white p-2 rounded-xl shadow-xl border border-slate-100 flex flex-col gap-1 z-50 pointer-events-auto min-w-[150px]" onClick={(e) => e.stopPropagation()}>
                          <span className="text-[9px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">Tab Portal Link:</span>
                          <button 
                            onClick={() => { takeSnapshot(); updateNode(node.id, { linkToTab: null }); setOpenLinkPicker(null); }}
                            className="w-full text-left px-2 py-1 text-xs font-semibold rounded hover:bg-slate-100 text-red-500"
                          >
                            Disconnect Portal
                          </button>
                          {workspaces.map(ws => (
                            <button
                              key={ws.id}
                              onClick={() => { takeSnapshot(); updateNode(node.id, { linkToTab: ws.id }); setOpenLinkPicker(null); }}
                              className="w-full text-left px-2 py-1 text-xs font-semibold rounded hover:bg-slate-100 flex items-center justify-between text-slate-700"
                            >
                              <span>{ws.name}</span>
                              {node.linkToTab === ws.id && <Check className="w-3 h-3 text-indigo-600" />}
                            </button>
                          ))}
                        </div>
                      )}

                      <button onClick={(e) => { e.stopPropagation(); setOpenColorPicker(openColorPicker === node.id ? null : node.id); setOpenLinkPicker(null); }} className="p-1 hover:bg-white/50 rounded text-slate-500" title="Node Theme"><Palette className="w-3.5 h-3.5"/></button>
                      {openColorPicker === node.id && (
                        <div className="absolute top-10 right-0 bg-white p-2 rounded-xl shadow-xl border border-slate-100 flex gap-1.5 z-50 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                          {Object.keys(THEMES).map(colorKey => (
                            <button key={colorKey} onClick={() => { takeSnapshot(); updateNode(node.id, { theme: colorKey }); setOpenColorPicker(null); }} className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-transform hover:scale-110 ${THEMES[colorKey].port}`}>
                              {node.theme === colorKey && <Check className="w-3 h-3 text-white" />}
                            </button>
                          ))}
                        </div>
                      )}

                      <button onClick={() => { takeSnapshot(); updateNode(node.id, { expanded: !node.expanded }); }} className="p-1 hover:bg-white/50 rounded text-slate-500" title="Expand/Collapse">{node.expanded ? <ChevronDown className="w-3.5 h-3.5"/> : <ChevronRight className="w-3.5 h-3.5"/>}</button>
                      <button onClick={() => deleteNode(node.id)} className="p-1 hover:bg-red-100 hover:text-red-600 rounded text-slate-400" title="Delete Node"><X className="w-3.5 h-3.5"/></button>
                    </div>


                    {/* Connecting Ports */}
                    <div className={`absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-full cursor-crosshair border-[3px] border-white z-30 shadow transition-transform group ${theme.port}`} onPointerDown={(e) => e.stopPropagation()} onPointerUp={(e) => { e.stopPropagation(); if (connecting && connecting.sourceId !== node.id) { const exists = edges.some(edge => edge.source === connecting.sourceId && edge.target === node.id); if (!exists) { takeSnapshot(); updateActiveWorkspace(ws => ({ edges: [...ws.edges, { id: `e-${Date.now()}`, source: connecting.sourceId, target: node.id }] })); } } setConnecting(null); }}>
                       <div className="absolute inset-0 m-auto w-8 h-8 -left-2 -top-2 rounded-full opacity-0 hover:opacity-20 bg-current transition-opacity" />
                    </div>
                    <div className={`absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-full cursor-crosshair border-[3px] border-white z-30 shadow transition-transform group ${theme.port}`} onPointerDown={(e) => { e.stopPropagation(); bringToFront(node.id); const coords = getWorkspaceCoords(e); setConnecting({ sourceId: node.id, startX: node.x + NODE_WIDTH, startY: node.y + HEADER_CENTER_Y, currentX: coords.x, currentY: coords.y }); }}>
                       <div className="absolute inset-0 m-auto w-8 h-8 -left-2 -top-2 rounded-full opacity-0 hover:opacity-20 bg-current transition-opacity" title="Drag to Connect" />
                    </div>
                  </div>

                  {/* Expandable description body */}
                  <div className={`transition-all duration-300 overflow-hidden ${node.expanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-4 flex flex-col gap-3 min-h-[9rem]" onPointerDown={(e) => e.stopPropagation()}>
                      
                      {node.linkToTab && (
                        <button 
                          onClick={() => {
                            const target = workspaces.find(w => w.id === node.linkToTab);
                            if (target) {
                              setActiveTab(target.id);
                            }
                          }}
                          className="flex items-center justify-between px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200/80 transition-all group pointer-events-auto w-full"
                        >
                          <span className="flex items-center gap-1.5">
                            <ExternalLink className="w-3.5 h-3.5 animate-pulse text-indigo-600" />
                            Portal: Jump to Map
                          </span>
                          <span className="text-indigo-900 font-extrabold max-w-[120px] truncate">
                            "{workspaces.find(w => w.id === node.linkToTab)?.name || 'Linked Map'}"
                          </span>
                        </button>
                      )}

                      {node.image && (
                        <div className="relative group w-full bg-black/5 rounded-lg p-2 border border-black/5 flex items-center justify-center">
                          <img src={node.image} alt="Node attachment" className="max-h-48 w-auto object-contain rounded" draggable={false} />
                          <button 
                            onClick={() => { takeSnapshot(); updateNode(node.id, { image: null }); }}
                            className="absolute top-2 right-2 p-1.5 bg-white text-slate-400 hover:text-red-500 rounded-md shadow opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove Image"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}


                      {/* Text Editor area */}
                      <div className="flex-1 w-full min-h-[4rem]">
                        {editingTextNode === node.id ? (
                          <textarea 
                            autoFocus
                            onBlur={() => setEditingTextNode(null)}
                            className="w-full h-full min-h-[4rem] bg-transparent resize-none focus:outline-none text-slate-600 text-xs leading-relaxed placeholder-slate-400 custom-scrollbar" 
                            value={node.content || ''} 
                            onChange={(e) => updateNode(node.id, { content: e.target.value })} 
                            placeholder="Write detailed requirements, paste a link, or drag-and-drop an image here..." 
                          />
                        ) : (
                          <div 
                            onClick={() => { takeSnapshot(); setEditingTextNode(node.id); }}
                            className="w-full h-full min-h-[4rem] bg-transparent overflow-y-auto text-slate-600 text-xs leading-relaxed custom-scrollbar cursor-text whitespace-pre-wrap"
                            title="Click to edit content"
                          >
                            {node.content ? renderLinks(node.content) : <span className="text-slate-400 italic">Write detailed requirements, paste a link, or drag-and-drop an image here...</span>}
                          </div>
                        )}
                      </div>

                      {/* Task Property Editor */}
                      {node.nodeType !== 'concept' && (
                      <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 gap-2">
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase">State</span>
                          <select 
                            className="text-xs bg-slate-50 border border-slate-200 rounded px-1 py-0.5 font-bold text-slate-700 outline-none hover:bg-slate-100 select-none cursor-pointer"
                            value={node.status || 'Todo'}
                            onChange={(e) => { takeSnapshot(); updateNode(node.id, { status: e.target.value }); }}
                          >
                            <option value="Todo">📌 Todo</option>
                            <option value="In Progress">⚡ In Progress</option>
                            <option value="Done">✅ Done</option>
                            <option value="Milestone">🏁 Milestone</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Priority</span>
                          <select 
                            className="text-xs bg-slate-50 border border-slate-200 rounded px-1 py-0.5 font-bold text-slate-700 outline-none hover:bg-slate-100 select-none cursor-pointer"
                            value={node.priority || 'Medium'}
                            onChange={(e) => { takeSnapshot(); updateNode(node.id, { priority: e.target.value }); }}
                          >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">🔥 High</option>
                          </select>
                        </div>
                      </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>


          {/* --- Bottom-Right Floating Zoom and Guides --- */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center gap-2 sm:gap-3 z-50">
            <div className="hidden sm:flex bg-white rounded-lg shadow-lg border border-slate-200 px-3.5 py-2.5 text-xs text-slate-500 font-medium items-center gap-2 max-w-sm">
              <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Right click cards to duplicate/raise. Double border indicates nested sub-group.</span>
            </div>

            <div className="flex flex-col items-center bg-white rounded-lg shadow-lg border border-slate-200 p-1">
              <button onClick={() => handleZoom(0.25)} className="p-1.5 sm:p-2 hover:bg-slate-100 text-slate-600 rounded-md transition-colors" title="Zoom In"><ZoomIn className="w-4 h-4 sm:w-5 sm:h-5"/></button>
              <div className="w-full h-[1px] bg-slate-200 my-0.5 sm:my-1" />
              <button onClick={() => setTransform({x:0, y:0, scale:1})} className="p-1.5 sm:p-2 hover:bg-slate-100 text-slate-600 rounded-md transition-colors" title="Reset View"><Focus className="w-4 h-4 sm:w-5 sm:h-5"/></button>
              <div className="w-full h-[1px] bg-slate-200 my-0.5 sm:my-1" />
              <button onClick={() => handleZoom(-0.25)} className="p-1.5 sm:p-2 hover:bg-slate-100 text-slate-600 rounded-md transition-colors" title="Zoom Out"><ZoomOut className="w-4 h-4 sm:w-5 sm:h-5"/></button>
            </div>
          </div>

          {/* --- Canvas Background Context Menu --- */}
          {contextMenu && (
            <div 
              className="absolute z-[200] bg-white border border-slate-200 rounded-xl shadow-xl py-2 min-w-[200px] animate-in fade-in zoom-in-95 duration-100"
              style={{ left: contextMenu.x, top: contextMenu.y }}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              onContextMenu={(e) => e.preventDefault()}
            >
              <button className="w-full text-left px-4 py-2 hover:bg-indigo-50 hover:text-indigo-900 text-sm font-semibold text-slate-700 flex items-center" onClick={() => { addNode(contextMenu.clientX, contextMenu.clientY, null, 'task'); setContextMenu(null); }}>
                <Plus className="w-4 h-4 mr-2 text-indigo-600" /> Add Task Node Here
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-violet-50 hover:text-violet-900 text-sm font-semibold text-slate-700 flex items-center" onClick={() => { addNode(contextMenu.clientX, contextMenu.clientY, null, 'concept'); setContextMenu(null); }}>
                <Sparkles className="w-4 h-4 mr-2 text-violet-600" /> Add Concept Node Here
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-indigo-50 hover:text-indigo-900 text-sm font-semibold text-slate-700 flex items-center" onClick={() => { createGroup(contextMenu.clientX, contextMenu.clientY); setContextMenu(null); }}>
                <Layers className="w-4 h-4 mr-2 text-indigo-600" /> Create Group Here
              </button>
              {localStorage.getItem('nexus-clipboard') && (
                <button className="w-full text-left px-4 py-2 hover:bg-indigo-50 hover:text-indigo-900 text-sm font-semibold text-slate-700 flex items-center" onClick={() => {
                  const rect = workspaceRef.current.getBoundingClientRect();
                  const pasteX = (contextMenu.clientX - rect.left - transform.x) / transform.scale;
                  const pasteY = (contextMenu.clientY - rect.top - transform.y) / transform.scale;
                  pasteNode(pasteX, pasteY);
                  setContextMenu(null);
                }}>
                  <ClipboardPaste className="w-4 h-4 mr-2 text-indigo-600" /> Paste Node Here
                </button>
              )}
              {localStorage.getItem('nexus-clipboard-group') && (
                <button className="w-full text-left px-4 py-2 hover:bg-indigo-50 hover:text-indigo-900 text-sm font-semibold text-slate-700 flex items-center" onClick={() => {
                  const rect = workspaceRef.current.getBoundingClientRect();
                  const pasteX = (contextMenu.clientX - rect.left - transform.x) / transform.scale;
                  const pasteY = (contextMenu.clientY - rect.top - transform.y) / transform.scale;
                  pasteGroup(pasteX, pasteY);
                  setContextMenu(null);
                }}>
                  <ClipboardPaste className="w-4 h-4 mr-2 text-indigo-600" /> Paste Group Here
                </button>
              )}
              <button className="w-full text-left px-4 py-2 hover:bg-slate-100 text-sm font-semibold text-slate-700 flex items-center" onClick={() => { setTransform({ x: 0, y: 0, scale: 1 }); setContextMenu(null); }}>
                <Focus className="w-4 h-4 mr-2 text-slate-500" /> Reset View
              </button>
              <div className="h-px bg-slate-200 my-1 w-full" />
              <button className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm font-semibold text-red-600 flex items-center" onClick={() => { setShowConfirmClear(true); setContextMenu(null); }}>
                <Trash2 className="w-4 h-4 mr-2 text-red-500" /> Clear Canvas
              </button>
            </div>
          )}


          {/* --- Card Specific Context Menu --- */}
          {nodeContextMenu && (
            <div 
              className="absolute z-[200] bg-white border border-slate-200 rounded-xl shadow-xl py-2 min-w-[180px] animate-in fade-in zoom-in-95 duration-100"
              style={{ left: nodeContextMenu.x, top: nodeContextMenu.y }}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              onContextMenu={(e) => e.preventDefault()}
            >
              <div className="px-4 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Card Actions</div>
              
              <button className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-xs font-semibold text-slate-700 flex items-center" onClick={() => { bringToFront(nodeContextMenu.nodeId); setNodeContextMenu(null); }}>
                <ArrowUp className="w-3.5 h-3.5 mr-2 text-indigo-600" /> Bring to Front
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-xs font-semibold text-slate-700 flex items-center" onClick={() => { sendToBack(nodeContextMenu.nodeId); setNodeContextMenu(null); }}>
                <ArrowDown className="w-3.5 h-3.5 mr-2 text-slate-500" /> Send to Back
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-xs font-semibold text-slate-700 flex items-center" onClick={() => { copyNode(nodeContextMenu.nodeId); setNodeContextMenu(null); }}>
                <Copy className="w-3.5 h-3.5 mr-2 text-slate-500" /> Copy Node
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-xs font-semibold text-slate-700 flex items-center" onClick={() => { cutNode(nodeContextMenu.nodeId); setNodeContextMenu(null); }}>
                <Scissors className="w-3.5 h-3.5 mr-2 text-slate-500" /> Cut Node
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-violet-50 text-xs font-semibold text-slate-700 flex items-center" onClick={() => { cloneNode(nodeContextMenu.nodeId); setNodeContextMenu(null); }}>
                <GitBranch className="w-3.5 h-3.5 mr-2 text-violet-500" /> Clone Node
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-xs font-semibold text-slate-700 flex items-center" onClick={() => { duplicateNode(nodeContextMenu.nodeId); setNodeContextMenu(null); }}>
                <Copy className="w-3.5 h-3.5 mr-2 text-slate-500" /> Duplicate Card
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-xs font-semibold text-slate-700 flex items-center" onClick={() => { disconnectNodeLinks(nodeContextMenu.nodeId); setNodeContextMenu(null); }}>
                <Link2 className="w-3.5 h-3.5 mr-2 text-slate-500" /> Break Connections
              </button>
              
              <div className="h-px bg-slate-150 my-1 w-full" />
              
              <button className="w-full text-left px-4 py-2 hover:bg-red-50 text-xs font-semibold text-red-600 flex items-center" onClick={() => { deleteNode(nodeContextMenu.nodeId); setNodeContextMenu(null); }}>
                <Trash2 className="w-3.5 h-3.5 mr-2 text-red-500" /> Delete Card
              </button>
            </div>
          )}

          {/* --- Group Context Menu --- */}
          {groupContextMenu && (
            <div 
              className="absolute z-[200] bg-white border border-slate-200 rounded-xl shadow-xl py-2 min-w-[180px] animate-in fade-in zoom-in-95 duration-100"
              style={{ left: groupContextMenu.x, top: groupContextMenu.y }}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              onContextMenu={(e) => e.preventDefault()}
            >
              <div className="px-4 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Group Actions</div>
              
              <button className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-xs font-semibold text-slate-700 flex items-center" onClick={() => { copyGroup(groupContextMenu.groupId); setGroupContextMenu(null); }}>
                <Copy className="w-3.5 h-3.5 mr-2 text-slate-500" /> Copy Group
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-xs font-semibold text-slate-700 flex items-center" onClick={() => { cutGroup(groupContextMenu.groupId); setGroupContextMenu(null); }}>
                <Scissors className="w-3.5 h-3.5 mr-2 text-slate-500" /> Cut Group
              </button>
              
              <div className="h-px bg-slate-150 my-1 w-full" />
              
              <button className="w-full text-left px-4 py-2 hover:bg-red-50 text-xs font-semibold text-red-600 flex items-center" onClick={() => { deleteGroup(groupContextMenu.groupId); setGroupContextMenu(null); }}>
                <Trash2 className="w-3.5 h-3.5 mr-2 text-red-500" /> Delete Group
              </button>
            </div>
          )}
        </main>

        {/* --- Clone Panels (Three-Panel Split View) --- */}
        {showClonePanel && viewMode === 'canvas' && (() => {
          // Find all source nodes that have clones
          const sourceNodes = nodes.filter(n => {
            return nodes.some(other => other.cloneSourceId === n.id);
          });

          // Get instances for the selected source
          const cloneInstances = selectedCloneSourceId ? nodes.filter(n => 
            n.id === selectedCloneSourceId || n.cloneSourceId === selectedCloneSourceId
          ) : [];

          return (
            <>
              {/* Panel B: Clone List */}
              <div className="w-[250px] shrink-0 bg-[#16213e] border-l border-slate-700/50 flex flex-col overflow-hidden transition-all duration-300">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
                  <h3 className="text-sm font-bold text-slate-200">Clone Nodes</h3>
                  <button onClick={() => { setShowClonePanel(false); setSelectedCloneSourceId(null); }} className="p-1 hover:bg-slate-700/50 rounded text-slate-400 hover:text-slate-200 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 flex flex-col gap-2">
                  {sourceNodes.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center mt-4">No clone nodes yet. Right-click a node and select "Clone Node" to create one.</p>
                  ) : (
                    sourceNodes.map(srcNode => {
                      const srcTheme = THEMES[srcNode.theme] || THEMES.amber;
                      const isSelected = selectedCloneSourceId === srcNode.id;
                      return (
                        <div
                          key={srcNode.id}
                          onClick={() => setSelectedCloneSourceId(srcNode.id)}
                          className={`px-3 py-2.5 rounded-lg cursor-pointer transition-all border-l-4 ${isSelected ? 'bg-slate-700/60 border-opacity-100' : 'bg-slate-800/40 hover:bg-slate-700/40 border-opacity-60'}`}
                          style={{ borderLeftColor: srcTheme.line, backgroundColor: isSelected ? undefined : `${srcTheme.line}10` }}
                        >
                          <span className="text-xs font-semibold text-slate-200 truncate block">{srcNode.title || `Node #${srcNode.id}`}</span>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">{nodes.filter(n => n.cloneSourceId === srcNode.id).length} clone(s)</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Panel C: Clone Locations */}
              <div className="w-[350px] shrink-0 bg-[#0f3460] border-l border-slate-700/50 flex flex-col overflow-hidden transition-all duration-300">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
                  <h3 className="text-sm font-bold text-slate-200">Clone Locations</h3>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 flex flex-col gap-2">
                  {!selectedCloneSourceId ? (
                    <p className="text-xs text-slate-400 text-center mt-4">Click a clone node to see its locations</p>
                  ) : (
                    cloneInstances.map(instance => {
                      // Find prev/next based on edges
                      const prevEdge = edges.find(e => e.target === instance.id);
                      const nextEdge = edges.find(e => e.source === instance.id);
                      const prevNode = prevEdge ? nodes.find(n => n.id === prevEdge.source) : null;
                      const nextNode = nextEdge ? nodes.find(n => n.id === nextEdge.target) : null;

                      return (
                        <div
                          key={instance.id}
                          onClick={() => {
                            // Navigate to node on canvas
                            if (workspaceRef.current) {
                              const rect = workspaceRef.current.getBoundingClientRect();
                              const centerX = rect.width / 2;
                              const centerY = rect.height / 2;
                              setTransform(prev => ({
                                ...prev,
                                x: centerX - instance.x * prev.scale - 170 * prev.scale,
                                y: centerY - instance.y * prev.scale - 80 * prev.scale
                              }));
                            }
                            setFocusedNodeId(instance.id);
                            setTimeout(() => setFocusedNodeId(null), 3000);
                          }}
                          className="px-3 py-2.5 rounded-lg cursor-pointer bg-slate-800/40 hover:bg-slate-700/40 transition-all border border-slate-700/30 hover:border-slate-600/50"
                        >
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <span className="text-slate-400 truncate max-w-[80px]">{prevNode ? prevNode.title || `Node #${prevNode.id}` : '(start)'}</span>
                            <span className="text-slate-500">→</span>
                            <span className="text-slate-200 font-bold truncate max-w-[100px]">{instance.title || `Node #${instance.id}`}</span>
                            <span className="text-slate-500">→</span>
                            <span className="text-slate-400 truncate max-w-[80px]">{nextNode ? nextNode.title || `Node #${nextNode.id}` : '(end)'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[9px] text-slate-500">{instance.cloneSourceId ? 'Clone' : 'Source'}</span>
                            {instance.groupId && <span className="text-[9px] text-slate-500">in {groups.find(g => g.id === instance.groupId)?.name || 'group'}</span>}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          );
        })()}

        {/* --- Outline Backlog Board View --- */}
        {viewMode === 'outline' && (
          <div className="flex-1 overflow-hidden flex flex-col bg-slate-50">
            <div className="px-3 sm:px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 gap-2">
              <div className="min-w-0">
                <h2 className="text-xs sm:text-sm font-bold text-slate-800 truncate">Outline Backlog Board</h2>
                <p className="text-[10px] text-slate-400 font-medium hidden sm:block">Structured nested view — changes sync to canvas instantly</p>
              </div>
              <div className="flex gap-1.5 sm:gap-2 shrink-0">
                <button onClick={() => addNode()} className="flex items-center px-2 sm:px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow transition-all">
                  <Plus className="w-3.5 h-3.5 sm:mr-1" /><span className="hidden sm:inline"> Add Card</span>
                </button>
                <button onClick={() => createGroup()} className="flex items-center px-2 sm:px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200 transition-all">
                  <Layers className="w-3.5 h-3.5 sm:mr-1" /><span className="hidden sm:inline"> Add Group</span>
                </button>
              </div>
            </div>
            {outlineBoardContent}
          </div>
        )}
      </div>


      {/* --- Modals and Dialogues --- */}
      {showConfirmClear && (
        <div className="absolute inset-0 bg-slate-900/40 z-[100] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-800 mb-1">Clear Current Canvas?</h3>
            <p className="text-slate-500 mb-6 text-xs leading-relaxed">This will permanently delete all nodes, groups and connections inside "{activeWs.name}".</p>
            <div className="flex justify-end gap-3">
              <button className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" onClick={() => setShowConfirmClear(false)}>Cancel</button>
              <button className="px-4 py-2 text-xs font-semibold bg-red-500 text-white hover:bg-red-600 rounded-lg shadow-sm transition-colors" onClick={clearAllNodes}>Clear Workspace</button>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="absolute inset-0 bg-slate-900/40 z-[100] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-red-600 mb-1">Upload Issue</h3>
            <p className="text-slate-500 mb-6 text-xs leading-relaxed">{errorMessage}</p>
            <div className="flex justify-end">
              <button className="px-4 py-2 text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors" onClick={() => setErrorMessage('')}>Close</button>
            </div>
          </div>
        </div>
      )}

      {pendingImageDrop && (
        <div className="absolute inset-0 bg-slate-900/50 z-[100] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-800 mb-1">Drop Image Options</h3>
            <p className="text-slate-500 mb-6 text-xs leading-relaxed text-left">
              How would you like to save this image? Compressing scales down resolution slightly to save browser workspace capacity.
            </p>
            <div className="flex flex-col gap-2.5">
              <button 
                onClick={() => processImage(pendingImageDrop.file, pendingImageDrop.nodeId, true)}
                className="w-full px-4 py-2.5 text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
              >
                Compress (Recommended)
              </button>
              <button 
                onClick={() => processImage(pendingImageDrop.file, pendingImageDrop.nodeId, false)}
                className="w-full px-4 py-2.5 text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Original (Could slow down browser if massive)
              </button>
              <button 
                onClick={() => setPendingImageDrop(null)}
                className="w-full px-4 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent rounded-lg transition-colors mt-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


      {/* --- Mobile Card Action Bottom Sheet --- */}
      {mobileSheet && (() => {
        const sheetNode = nodes.find(n => n.id === mobileSheet);
        if (!sheetNode) return null;
        const sheetTheme = THEMES[sheetNode.theme] || THEMES.amber;
        return (
          <div className="fixed inset-0 z-[300] flex flex-col justify-end" onClick={() => setMobileSheet(null)}>
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <div
              className="relative bg-white rounded-t-3xl shadow-2xl border-t border-slate-200 animate-in slide-in-from-bottom duration-300 pb-safe"
              onClick={(e) => e.stopPropagation()}
              style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-slate-300" />
              </div>

              <div className={`mx-4 mt-2 mb-3 p-3 rounded-2xl border ${sheetTheme.groupHeader} ${sheetTheme.groupBg}`}>
                <div className="flex items-center gap-2.5">
                  <div className={`w-3 h-3 rounded-full ${sheetTheme.port}`} />
                  <span className={`font-bold text-sm flex-1 truncate ${sheetTheme.text}`}>{sheetNode.title || `Task #${sheetNode.id}`}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${sheetTheme.tag}`}>{sheetNode.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 px-4 pb-2">
                {[
                  { icon: <ArrowUp className="w-5 h-5" />, label: 'Bring Front', action: () => { bringToFront(mobileSheet); setMobileSheet(null); }, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
                  { icon: <ArrowDown className="w-5 h-5" />, label: 'Send Back', action: () => { sendToBack(mobileSheet); setMobileSheet(null); }, color: 'text-slate-600 bg-slate-50 border-slate-200' },
                  { icon: <Copy className="w-5 h-5" />, label: 'Duplicate', action: () => { duplicateNode(mobileSheet); setMobileSheet(null); }, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                  { icon: <Link2 className="w-5 h-5" />, label: 'Disconnect', action: () => { disconnectNodeLinks(mobileSheet); setMobileSheet(null); }, color: 'text-amber-600 bg-amber-50 border-amber-200' },
                  { icon: <Palette className="w-5 h-5" />, label: 'Change Theme', action: () => { const themes = Object.keys(THEMES); const ci = themes.indexOf(sheetNode.theme); takeSnapshot(); updateNode(mobileSheet, { theme: themes[(ci + 1) % themes.length] }); }, color: 'text-purple-600 bg-purple-50 border-purple-200' },
                  { icon: <Trash2 className="w-5 h-5" />, label: 'Delete', action: () => { deleteNode(mobileSheet); setMobileSheet(null); }, color: 'text-red-600 bg-red-50 border-red-200' },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={item.action}
                    className={`flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-2xl border font-semibold text-[11px] transition-all active:scale-95 ${item.color}`}
                  >
                    {item.icon}
                    <span className="leading-tight text-center">{item.label}</span>
                  </button>
                ))}
              </div>


              <div className="px-4 py-3 border-t border-slate-100 mt-1 flex gap-4">
                <div className="flex-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Status</span>
                  <div className="flex flex-wrap gap-1">
                    {['Todo', 'In Progress', 'Done', 'Milestone'].map(s => (
                      <button key={s} onClick={() => { takeSnapshot(); updateNode(mobileSheet, { status: s }); }} className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all ${sheetNode.status === s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'}`}>{s}</button>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Priority</span>
                  <div className="flex gap-1">
                    {['Low', 'Medium', 'High'].map(p => (
                      <button key={p} onClick={() => { takeSnapshot(); updateNode(mobileSheet, { priority: p }); }} className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all ${sheetNode.priority === p ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'}`}>{p}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4">
                <button onClick={() => setMobileSheet(null)} className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-sm rounded-xl transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dash { to { stroke-dashoffset: -14; } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .canvas-grid-clickable { pointer-events: auto !important; }
      `}} />
    </div>
  );
}
