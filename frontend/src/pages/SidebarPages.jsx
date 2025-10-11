import React, { useEffect, useState } from "react";
import MenuSidebar from "@/components/sidebar/MenuSidebar";
import { Link, useLocation } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import NavBar from "@/components/navbar/Navbar";
import AccountSettingsPage from "./AccountSettingsPage";

const AccountPage = () => {
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState();

  useEffect(() => {
    if (location.state && location.state.selectedTab) {
      setSelectedTab(location.state.selectedTab);
    } else {
      setSelectedTab(null);
    }
  }, [location.state]);

  return (
    <div>
      <NavBar />
      <div>
        <SidebarProvider>
          <MenuSidebar
            selectedTab={selectedTab}
            onProfileClick={() => setSelectedTab("Account")}
          />
          <SidebarInset className={"mt-20"}>
            <div className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className={"cursor-pointer"} />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink asChild>
                        <Link to="/">Home</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink asChild>
                        <BreadcrumbPage>{selectedTab}</BreadcrumbPage>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>
            <main>
              <AccountSettingsPage />
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default AccountPage;
