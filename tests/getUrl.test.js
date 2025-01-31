const { getOriginUrl } = require("../controllers/urlController");
const Url = require("../models/url");

jest.mock("../models/url"); // Mock Mongoose Model

describe("getOriginUrl function", () => {
  let req, res;

  beforeEach(() => {
    req = { params: { shortened_id: "xyz789" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    jest.clearAllMocks(); // Reset mocks before each test
  });

  it("should return an HTML page that redirects to the original URL", async () => {
    Url.findOne.mockResolvedValue({ originUrl: "https://example.com" });

    await getOriginUrl(req, res);

    expect(res.send).toHaveBeenCalledWith(expect.stringContaining("window.location.href = \"https://example.com\";"));
  });

  it("should return 404 if the shortened URL is not found", async () => {
    Url.findOne.mockResolvedValue(null);

    await getOriginUrl(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "URL not found" });
  });

  it("should return 400 if an error occurs", async () => {
    Url.findOne.mockRejectedValue(new Error("DB Error"));

    await getOriginUrl(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Error getting url shorten" });
  });
});
