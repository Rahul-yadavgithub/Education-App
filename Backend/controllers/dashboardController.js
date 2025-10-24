const getDashboardData = (req, res) => {
  res.status(200).json({
    message: "Dashboard data loaded successfully!",
  });
};

module.exports = {
  getDashboardData
};
