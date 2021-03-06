import { useEffect, useState } from 'react'
import { Node } from './Node'
import { initialGrid, arrayEquals, updateGrid, num_cols } from '../utils'
import { dfs, bfs, astar } from '../algorithms'

export const Grid = () => {
  const [grid, setGrid] = useState();
  const [findPath, setFindPath] = useState(false)
  const [start, setStart] = useState([11, 2])
  const [end, setEnd] = useState([11, 19])
  const [obstacle, setObstacle] = useState([])
  const [mousePressed, setMousePressed] = useState(false)
  const [fixStart, setFixStart] = useState(false)
  const [fixEnd, setFixEnd] = useState(false)
  const [algorithm, setAlgorithm] = useState('dfs')

  const START_ROW = start[0]
  const START_COL = start[1]
  const END_ROW = end[0]
  const END_COL = end[1]

  useEffect(() => {
    setGrid(initialGrid(start, end, obstacle))
  }, [])

  useEffect(() => {
    if (findPath) {
      switch (algorithm) {
        case 'dfs':
          dfs([START_ROW, START_COL], [END_ROW, END_COL], grid, setGrid, obstacle, findPath)
          break
        case 'bfs':
          bfs([START_ROW, START_COL], [END_ROW, END_COL], grid, setGrid, obstacle, findPath)
          break
        case 'astar':
          astar([START_ROW, START_COL], [END_ROW, END_COL], grid, setGrid, obstacle, findPath)
          break
        default:
          astar([START_ROW, START_COL], [END_ROW, END_COL], grid, setGrid, obstacle, findPath)

      }
      setFindPath(false)
    }
  }, [findPath])

  const toggleObstacle = (coordinate) => {
    if (arrayEquals(start, coordinate) || arrayEquals(end, coordinate)) {
      return
    }
    let index = obstacle.findIndex(el => arrayEquals(coordinate, el))
    if (index >= 0) {
      let newObstacle = [...obstacle]
      newObstacle.splice(index, 1)
      setObstacle(newObstacle)
      updateGrid(grid, setGrid, coordinate, 'undiscovered')
    } else {
      obstacle.push(coordinate)
      setObstacle(obstacle)
      updateGrid(grid, setGrid, coordinate, 'obstacle')
    }
  }

  const handleMouseDown = (coordinate, e) => {
    if (fixStart) {
      setStart(coordinate)
      updateGrid(grid, setGrid, start, 'undiscovered')
      updateGrid(grid, setGrid, coordinate, 'start')
      setFixStart(false)
    } else if (fixEnd) {
      setEnd(coordinate)
      updateGrid(grid, setGrid, end, 'undiscovered')
      updateGrid(grid, setGrid, coordinate, 'destination')
      setFixEnd(false)
    } else {
      e.preventDefault()
      setMousePressed(true)
      toggleObstacle(coordinate)
    }
  }

  const handleMouseEnter = (coordinate) => {
    if (mousePressed) {
      toggleObstacle(coordinate)
    }
  }

  const handleMouseUp = () => {
    setMousePressed(false)
  }

  const handleFixStart = () => {
    setFixStart(true)
  }

  const handleFixEnd = () => {
    setFixEnd(true)
  }

  let nodes = []
  if (grid !== undefined) {
    grid.forEach((row, row_index) => {
      row.forEach((node, col_index) => {
        nodes.push(<Node 
                      key={node.id} 
                      id={node.id} 
                      status={node.status} 
                      row_index={row_index}
                      col_index={col_index}
                      toggleObstacle={toggleObstacle}
                      handleMouseDown={handleMouseDown}
                      handleMouseEnter={handleMouseEnter}
                      handleMouseUp={handleMouseUp}
                      />)
      });
    });
  }

  return (
    <div className='top-wrapper'>
      <div>
        <input type="radio" id="dfs" name="algo" value="dfs" checked={algorithm === 'dfs'} onChange={e => { setAlgorithm(e.target.value); setGrid(initialGrid(start, end, obstacle)); }}/>
        <label htmlFor="dfs">DFS</label> <br/>
        <input type="radio" id="bfs" name="algo" value="bfs" checked={algorithm === 'bfs'} onChange={e => { setAlgorithm(e.target.value); setGrid(initialGrid(start, end, obstacle)); }}/>
        <label htmlFor="bfs">BFS</label> <br/>
        <input type="radio" id="astar" name="algo" value="astar" checked={algorithm === 'astar'} onChange={e => { setAlgorithm(e.target.value); setGrid(initialGrid(start, end, obstacle)); }}/>
        <label htmlFor="astar">A*</label> 
      </div>

      <div className='wrapper'>
        <div className='controls'>
          <div>
            <button onClick={() => setFindPath(true)}>Find Path</button>
            <button onClick={() => window.location.reload()}>Stop/Reset</button>
          </div>
          <div>
            <button onClick={handleFixStart} disabled={fixStart}>Fix Start</button>
            <button onClick={handleFixEnd} disabled={fixEnd}>Fix End</button>
          </div>
        </div>

        <div className='container' style={{ gridTemplateColumns: `repeat(${num_cols}, 1fr)`}}>
          {nodes}
        </div>
      </div>
    </div>
  )
}