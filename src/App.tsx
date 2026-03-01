import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import BlogList from './pages/BlogList'
import BlogPost from './pages/BlogPost'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import Tools from './pages/Tools'
import GuidGenerator from './pages/GuidGenerator'
import JsonColumnFormatter from './pages/JsonColumnFormatter'
import Tasks from './pages/Tasks'
import TaskBoard from './pages/TaskBoard'
import PinGate from './components/PinGate'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/tools/guid-generator" element={<GuidGenerator />} />
          <Route path="/tools/json-column-formatter" element={<JsonColumnFormatter />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/tasks" element={<PinGate><Tasks /></PinGate>} />
          <Route path="/board" element={<PinGate><TaskBoard /></PinGate>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
