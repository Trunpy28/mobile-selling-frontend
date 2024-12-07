import { useEffect, useState } from "react";
import { Spin } from "antd";
import Chart from "react-apexcharts";
import { IoStorefront, IoPerson } from "react-icons/io5";
import brandService from "../../services/brandService";
import productService from "../../services/productService";
import userService from "../../services/userService";

const Dashboard = () => {
    const [brandData, setBrandData] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const [brandsRes, productsRes, usersRes] = await Promise.all([
                    brandService.getBrandsWithProductCount(),
                    productService.countTotalProducts(),
                    userService.countTotalUsers(),
                ]);

                const brands = brandsRes.data;
                const totalProductCount = productsRes.data;
                const totalUserCount = usersRes.totalUsers;

                const formattedBrandData = brands.map((brand) => ({
                    name: brand.name,
                    count: brand.productCount,
                }));

                setBrandData(formattedBrandData);
                setTotalProducts(totalProductCount);
                setTotalUsers(totalUserCount);
            } catch (err) {
                console.error("Failed to fetch data:", err);
                setError("Failed to fetch data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const chartOptions = {
        chart: {
            type: "bar",
            toolbar: { show: false },
        },
        xaxis: {
            categories: brandData.map((brand) => brand.name),
        },
        colors: ["#4299E1"],
        dataLabels: { enabled: false },
    };

    const chartSeries = [
        {
            name: "Số lượng",
            data: brandData.map((brand) => brand.count),
        },
    ];

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    return (
        <div className="px-6">
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <Spin size="large" tip="Loading Dashboard..." />
                </div>
            ) : (
                <>
                    <h1 className="font-bold text-3xl text-gray-800 pb-5">Dashboard</h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <div
                            className="p-6 rounded-lg shadow-md flex items-center gap-4"
                            style={{ backgroundColor: "#4299E120" }}
                        >
                            <IoStorefront size={32} color="#4299E1" />
                            <div>
                                <h3 className="text-xl font-medium">Sản phẩm</h3>
                                <p
                                    className="text-3xl font-semibold"
                                    style={{ color: "#4299E1" }}
                                >
                                    {totalProducts}
                                </p>
                            </div>
                        </div>

                        <div
                            className="p-6 rounded-lg shadow-md flex items-center gap-4"
                            style={{ backgroundColor: "#48BB7820" }}
                        >
                            <IoPerson size={32} color="#48BB78" />
                            <div>
                                <h3 className="text-xl font-medium">Người dùng</h3>
                                <p
                                    className="text-3xl font-semibold"
                                    style={{ color: "#48BB78" }}
                                >
                                    {totalUsers}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                        <h3 className="text-xl font-medium text-gray-600">
                            Sản phẩm theo thương hiệu
                        </h3>
                        <div className="mt-4">
                            <Chart
                                options={chartOptions}
                                series={chartSeries}
                                type="bar"
                                height={300}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
