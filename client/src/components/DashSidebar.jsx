import { Sidebar } from "flowbite-react";
import { useState, useEffect } from "react";
import { HiArrowSmRight, HiDocumentText, HiUser } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";

export default function DashSidebar() {
  const {
    currentUser: { isAdmin },
  } = useSelector((state) => state.user);
  //   const { isAdmin } = currentUser;
  const location = useLocation();
  const dispatch = useDispatch();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-2">
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              labelColor="dark"
              label={isAdmin ? "Admin" : "User"}
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {isAdmin && (
            <Link to="/dashboard?tab=posts">
              <Sidebar.Item
                as="div"
                icon={HiDocumentText}
                active={tab === "posts"}
              >
                Posts
              </Sidebar.Item>
            </Link>
          )}
          <Sidebar.Item
            onClick={handleSignOut}
            active
            icon={HiArrowSmRight}
            className="cursor-pointer"
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
