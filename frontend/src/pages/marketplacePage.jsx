import MarketplaceGrid from "../components/marketPlaceGrid";
import NavigationBar from "../components/navigationBar";

const MarketplacePage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <NavigationBar />
            <MarketplaceGrid />
        </div>
    );
}

export default MarketplacePage;