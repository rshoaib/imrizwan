

interface BlogSearchProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  onClear: () => void
}

export default function BlogSearch({ searchQuery, setSearchQuery, onClear }: BlogSearchProps) {
  return (
    <div className="search-bar">
      <span className="search-bar__icon">🔍</span>
      <input
        type="text"
        className="search-bar__input"
        placeholder="Search posts or #tag..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <button
          className="search-bar__clear"
          onClick={onClear}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  )
}
