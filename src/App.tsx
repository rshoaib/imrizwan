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
import CamlQueryBuilder from './pages/CamlQueryBuilder'
import PermissionMatrix from './pages/PermissionMatrix'
import RestApiBuilder from './pages/RestApiBuilder'
import SiteScriptGenerator from './pages/SiteScriptGenerator'
import PnPScriptGenerator from './pages/PnPScriptGenerator'
import Tasks from './pages/Tasks'
import PinGate from './components/PinGate'
import GoogleAnalytics from './components/GoogleAnalytics'

function App() {
  return (
    <BrowserRouter>
      <GoogleAnalytics />
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
          <Route path="/tools/caml-query-builder" element={<CamlQueryBuilder />} />
          <Route path="/tools/permission-matrix" element={<PermissionMatrix />} />
          <Route path="/tools/rest-api-builder" element={<RestApiBuilder />} />
          <Route path="/tools/site-script-generator" element={<SiteScriptGenerator />} />
          <Route path="/tools/pnp-script-generator" element={<PnPScriptGenerator />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/tasks" element={<PinGate><Tasks /></PinGate>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
