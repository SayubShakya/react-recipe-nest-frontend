import "./App.css";
import Home from "./pages/home";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/header";
import HeaderUsers from "./components/headerUsers";
import Footer from "./components/footer";
import FoodDetail from "./pages/food/detail";
import FoodsList from "./pages/food";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import FoodLoverDashboard from "./pages/foodLover/dashboard";
import EditProfile from "./pages/foodLover/profile/editProfile";
import Favorites from "./pages/foodLover/favorites/favorites";
import ViewChefs from "./pages/foodLover/view/viewChefs";
import ChefDashboard from "./pages/chef/dashboard";
import EditChefProfile from "./pages/chef/profile/editChefProfile";

import ChefBio from "./components/ChefBio";
import AdminDashboard from "./pages/admin/dashboard";
import AdminEditProfile from "./pages/admin/profile/edit/adminEditProfile";
import ActivateUserForm from "./pages/admin/users/activateUser/activateUserForm";
import ResetUserPasswordForm from "./pages/admin/users/resetPassword/resetUserPasswordForm";
import ManageCuisine from "./pages/admin/categories";

import DeleteCategoryPage from "./pages/admin/categories/deleteCuisine";

import ManageRecipe from "./pages/chef/recipe/list/manageRecipe";
import { Bounce, ToastContainer } from "react-toastify";
import ManageRoles from "./pages/admin/roles";
import ManageUsers from "./pages/admin/users/manageUsers";
import EditCategoryPage from "./pages/admin/categories/editCuisine";
import RecipeForm from "./pages/chef/recipe/form";
import DeleteRecipe from "./pages/chef/recipe/delete/deleteRecipe";
import ViewRecipe from "./pages/chef/recipe/detail/viewRecipe";
import ManageRecipeAdmin from "./pages/admin/recipe/list/manageRecipeAdmin";
import RecipeFormAdmin from "./pages/admin/recipe/form";
import DeleteRecipeAdmin from "./pages/admin/recipe/delete/deleteRecipe";
import ViewRecipeAdmin from "./pages/admin/recipe/detail/viewRecipe";

function App() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  const isHomePage = location.pathname === "/";

  return (
    <div className="app-container">
      <ToastContainer />
      {isHomePage && !isAuthPage && <Header />}
      {!isHomePage && !isAuthPage && <HeaderUsers />}
      <main className="content-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/foodLoverDashboard" element={<FoodLoverDashboard />} />
          <Route path="/editProfile" element={<EditProfile />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/viewChefs" element={<ViewChefs />} />

          <Route path="/chefDashboard" element={<ChefDashboard />} />
          <Route path="/editChefProfile" element={<EditChefProfile />} />
          <Route path="/createRecipe" element={<RecipeForm />} />
          <Route path="/manageRecipe" element={<ManageRecipe />} />
          <Route path="/manageRoles" element={<ManageRoles />} />
          <Route path="/createRecipe/:id" element={<RecipeForm />} />
          <Route path="/deleteRecipe/:id" element={<DeleteRecipe />} />
          <Route path="/viewRecipe/:id" element={<ViewRecipe />} />
          <Route path="/editCategoryPage/:id" element={<EditCategoryPage />} />

          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/adminEditProfile" element={<AdminEditProfile />} />
          <Route path="/manageUsers" element={<ManageUsers />} />
          <Route path="/activateUserForm" element={<ActivateUserForm />} />

          <Route path="/manageRecipeAdmin" element={<ManageRecipeAdmin />} />
          <Route path="/createRecipeAdmin" element={<RecipeFormAdmin />} />
          <Route path="/editRecipeAdmin/:id" element={<RecipeFormAdmin />} />
          <Route
            path="/deleteRecipeAdmin/:id"
            element={<DeleteRecipeAdmin />}
          />
          <Route path="/viewRecipeAdmin/:id" element={<ViewRecipeAdmin />} />

          <Route
            path="/resetUserPasswordForm"
            element={<ResetUserPasswordForm />}
          />
          <Route path="/manageCuisine" element={<ManageCuisine />} />
          <Route path="/chefs/:id" element={<ChefBio />} />
          <Route path="/foods" element={<FoodsList />} />
          <Route path="/food/:id" element={<FoodDetail />} />
          <Route
            path="/deleteCategoryPage/:id"
            element={<DeleteCategoryPage />}
          />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;
