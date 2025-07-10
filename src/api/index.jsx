const useApi = () => {
  const URL = "http://localhost:9000/api/rest/";

  const fetchData = async (path) => {
    let authHeaders = {};

    if (sessionStorage.getItem("token")) {
      authHeaders = {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      };
    }

    const response = await fetch(`${URL}${path}`, {
      headers: {
        ...authHeaders
      },
    });
    return response;
  };

  const postData = async (path, bodyData) => {
    let authHeaders = {};

    if (sessionStorage.getItem("token")) {
      authHeaders = {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      };
    }

    const response = await fetch(`${URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders
      },
      body: JSON.stringify(bodyData),
    });
    return response;
  };

  const putData = async (path, bodyData) => {
    const response = await fetch(`${URL}${path}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });
    return response;
  };

  const deleteData = async (path) => {
    const response = await fetch(`${URL}${path}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response;
  };

  return { fetchData, postData, putData, deleteData };
};

export default useApi;
