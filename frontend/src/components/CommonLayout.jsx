import { useEffect, useState } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import Nav from "./common/Nav";
import Header from "./common/Header";
import Chatbot from "./common/Chatbot";

function CommonLayout() {
  const [isproject, setisproject] = useState(false);
  const params = useParams();
  const location = useLocation();

  useEffect(() => {
    if (params?.id) setisproject(true);
    else setisproject(false);
  }, [params]);

  return (
    <div className="flex min-h-screen min-w-screen">
      {isproject && <Nav />}

      {/* Main Content */}
      <main className={`flex-1 flex flex-col ${isproject ? "ml-64" : "ml-0"}`}>
        {/* 자식 컴포넌트를 렌더링 */}
        {location.pathname.includes("project") && <Header />}
        <Outlet />
        {location.pathname.split("/")[1] && <Chatbot />}
      </main>
    </div>
  );
}

export default CommonLayout;
