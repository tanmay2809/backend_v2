


const fileUpload = async (req, res) => {
  if (!req?.file) {
    res.status(403).json({ status: false, error: "please upload a file" });
    return;
  }
  let data = {};
  if (!!req?.file) {
    data = {
      url: req.file.location,
      type: req.file.mimetype,
    };
  }
  try {
    res.send({
      data: data,
      status: true,
    });
  } catch (error) {
    res.status(403).json({ status: false, error: error });
  }
};


module.exports = fileUpload;