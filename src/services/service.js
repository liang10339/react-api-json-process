import http from "../http-common";

class StaticDataService {
  getAll() {
    return http.get("/");
  }
}

export default new StaticDataService();