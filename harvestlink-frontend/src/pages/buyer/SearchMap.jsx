import React from "react";

import Footer from "../../components/layout/Footer";
import PageHeader from "../../components/common/PageHeader"; // <--- Import
import TopBar from "../../components/layout/Topbar";
import NavBar from "../../components/layout/Navbar";

const SearchMap = () => {
  return (
    <div className="flex flex-col min-h-screen">
    <TopBar />
    <NavBar />

      <main className="flex-grow">
        {/* Add the Header */}
        <PageHeader title="Shop" />

        <div className="container mx-auto px-4 text-center py-10">
          <h2 className="text-2xl font-bold text-harvest-dark mb-4">
            "Find Fresh Produce"
          </h2>
          <div className="p-10 border border-dashed border-gray-300 rounded-xl bg-gray-50">
            Map and Search Interface Coming Soon...
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchMap;
