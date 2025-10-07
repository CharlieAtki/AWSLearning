import NavigationBar from "../components/navigationBar";
import BusinessDashboardSideBar from "../components/businessDashboardSideBar";

const BusinessDashboardPage = () => {
    return (
        <div className="flex flex-col min-h-screenbg-gray-100 dark:bg-gray-800">
            <NavigationBar />
            <BusinessDashboardSideBar />
        </div>
    );
};

export default BusinessDashboardPage;
