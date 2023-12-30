import express from "express";
import axios from "axios";
import crypto from "crypto";

const app = express();
const port = 8080;

const merchantURL = "https://secure.wayforpay.com/pay";
const secretKey = "flk3409refn54t54t*FNJRET";

// hardcode merhant data
const merchantAccount = "test_merch_n1";
const merchantDomainName = "www.market.ua";
const merchantTransactionSecureType = "AUTO";
const currency = "UAH";
const merchantAuthType = "SimpleSignature";

app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const {
      orderReference,
      orderDate,
      amount,
      productName,
      productPrice,
      productCount,
    } = req.body;

    const merchantSignatureData = `${merchantAccount};${merchantDomainName};${orderReference};${orderDate};${amount};${currency};${productName[0]};${productCount[0]};${productPrice[0]}`;

    const merchantSignature = calculateMerchantSignature(
      merchantSignatureData,
      secretKey
    );
    const paymentData = {
      merchantAccount: "test_merch_n1",
      merchantDomainName: "www.market.ua",
      orderReference: "D1H1695480743",
      orderDate: "1415379863",
      amount: 4,
      currency: "UAH",
      productName: ["test1"],
      productPrice: [4],
      productCount: [1],
      merchantSignature: "2e47691fb504277e7e538c404bcd7777",
    };
    const response = await axios.post(merchantURL, paymentData);
    console.log(response);

    console.log(paymentData);

    res.status(200).json({ signa: merchantSignature, data: response.data });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

function calculateMerchantSignature(signature, key) {
  const hash = crypto.createHmac("md5", key).update(signature).digest("hex");
  return hash;
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
