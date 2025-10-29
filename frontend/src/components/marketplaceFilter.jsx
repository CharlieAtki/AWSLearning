import { useCallback, useEffect, useMemo, useState } from "react";

const MarketplaceFilter = ({ filters, onChange }) => {
    const [local, setLocal] = useState(filters || {});

    // Keep local state in sync if parent resets filters
    useEffect(() => {
        setLocal(filters || {});
    }, [filters]);

    // Debounced propagate for search to avoid excessive renders
    useEffect(() => {
        const id = setTimeout(() => {
            onChange && onChange(prev => ({ ...prev, search: local.search || "" }));
        }, 250);
        return () => clearTimeout(id);
    }, [local.search, onChange]);

    const handleField = useCallback((key, value) => {
        setLocal(prev => ({ ...prev, [key]: value }));
        if (key !== 'search') {
            // immediate propagate for non-search fields
            onChange && onChange(prev => ({ ...prev, [key]: value }));
        }
    }, [onChange]);

    const resetFilters = useCallback(() => {
        const cleared = { search: "", minPrice: "", maxPrice: "", category: "", business: "", sort: "relevance" };
        setLocal(cleared);
        onChange && onChange(() => cleared);
    }, [onChange]);

    return (
        <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-6 py-3 sticky top-0 z-40">
            <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {/* Search by name */}
                    <div className="col-span-1 lg:col-span-2">
                        <input
                            type="text"
                            value={local.search || ""}
                            onChange={(e) => handleField('search', e.target.value)}
                            placeholder="Search by name..."
                            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Min price */}
                    <div>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={local.minPrice}
                            onChange={(e) => handleField('minPrice', e.target.value)}
                            placeholder="Min price"
                            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Max price */}
                    <div>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={local.maxPrice}
                            onChange={(e) => handleField('maxPrice', e.target.value)}
                            placeholder="Max price"
                            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <input
                            type="text"
                            value={local.category}
                            onChange={(e) => handleField('category', e.target.value)}
                            placeholder="Category"
                            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Business (ID or name if present) */}
                    <div>
                        <input
                            type="text"
                            value={local.business}
                            onChange={(e) => handleField('business', e.target.value)}
                            placeholder="Business"
                            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Sort */}
                    <div>
                        <select
                            value={local.sort || 'relevance'}
                            onChange={(e) => handleField('sort', e.target.value)}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="relevance">Sort: Relevance</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="name-asc">Name: A to Z</option>
                            <option value="name-desc">Name: Z to A</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={resetFilters}
                        className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 transition"
                    >
                        Reset Filters
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MarketplaceFilter;