import NavigationBar from "../components/navigationBar";
import BusinessDashboardSideBar from "../components/businessDashboardSideBar";
import { Outlet } from "react-router-dom";

const BusinessDashboardPage = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-800">
            <NavigationBar />
            <div className="flex flex-1">
                <BusinessDashboardSideBar />
                <main className="flex-1 p-4 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default BusinessDashboardPage;
