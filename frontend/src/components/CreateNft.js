import React, { useState, useContext } from "react";
import Context from "../context/contractContext";
import axios from "axios";
import { useForm } from "react-hook-form";

// https://gateway.pinata.cloud/ipfs/QmYXEZGtq2pSS7ESzSxHvzqWBokqAmwSB6UiEJAzx8CM2u

//https://ipfs.io/ipfs/QmYXEZGtq2pSS7ESzSxHvzqWBokqAmwSB6UiEJAzx8CM2u

export default function CreateNft() {
  const context = useContext(Context);
  const contractFunction = context.contractFunction;
  const [File, setFile] = useState(null);
  const [FileHash, setFileHash] = useState(null);
  const [MetaDataHash, setMetaDataHash] = useState(null);
  const [IsDisabled, setIsDisabled] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleFileUpload = async (e) => {
    console.log("handling file upload");
    setFile(e.target.files[0]);
  };

  const sendFileToIPFS = async (data, fileName) => {
    try {
      const formData = new FormData();
      formData.append("file", data, fileName);

      console.log("sending file to IPFS..........");
      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS", //pinJSONToIPFS
        data: formData,
        headers: {
          pinata_api_key: `5118d12a0f3128be332d`, //${process.env.REACT_APP_PINATA_API_KEY}
          pinata_secret_api_key: `8660c87818cb1522c2c08d141ed393eeff441cad866f34da9775816bbdbbd809`, //${process.env.REACT_APP_PINATA_API_SECRET}
          "Content-Type": "multipart/form-data",
        },
      });

      if (resFile) {
        // const ImgHash = `https://ipfs.io/ipfs/${resFile.data.IpfsHash}`;
        setFileHash(resFile.data.IpfsHash);
        return resFile.data.IpfsHash;
        // console.log("File successfully sent to IPFS", ImgHash);
      }
    } catch (error) {
      alert("Error sending File to IPFS: ");
      console.log("Error sending File to IPFS: ");
      console.log(error);
    }
  };

  const sendMetaDataToIPFS = async (filehash) => {
    try {
      if (filehash) {
        const metaData = JSON.stringify({
          name: document.getElementById("name").value,
          description: document.getElementById("desc").value,
          data: filehash,
        });

        console.log("sending json to IPFS..........");
        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinJSONToIPFS", //pinFileToIPFS
          data: metaData,
          headers: {
            pinata_api_key: `5118d12a0f3128be332d`, //${process.env.REACT_APP_PINATA_API_KEY}
            pinata_secret_api_key: `8660c87818cb1522c2c08d141ed393eeff441cad866f34da9775816bbdbbd809`, //${process.env.REACT_APP_PINATA_API_SECRET}
            "Content-Type": "application/json",
          },
        });

        if (resFile) {
          setMetaDataHash(resFile.data.IpfsHash);
          return resFile.data.IpfsHash;
        }
      } else {
        alert("Error. null file hash ");
        console.log("Error. null file hash");
      }
    } catch (error) {
      alert("Error sending json to IPFS: ");
      console.log("Error sending json to IPFS: ");
      console.log(error);
    }
  };

  async function uploadDataToIPFS() {
    const responseFuncOne = await sendFileToIPFS(File, File.name);
    if (responseFuncOne) {
      setFileHash(responseFuncOne);
      const responseFuncTwo = await sendMetaDataToIPFS(responseFuncOne);
      if (responseFuncTwo) {
        setMetaDataHash(responseFuncTwo);
        return responseFuncTwo;
      }
    }
  }

  const onSubmit = () => {
    const copies = document.getElementById("copies").value;

    try {
      if (parseInt(copies) <= 0) {
        alert("copies should be greater than zero");
      } else {
        mintNft();
      }
    } catch (error) {
      alert("Error while parsing the inputs");
      console.log(error);
    }
  };

  const mintNft = async () => {
    const copies = document.getElementById("copies").value;
    try {
      if (parseInt(copies) > 0 && File) {
        setIsDisabled(true);
        let metaHash = await uploadDataToIPFS();

        if (metaHash) {
          contractFunction.mint(metaHash, parseInt(copies)).then(() => {
            setTimeout(() => {
              setFileHash(null);
              setMetaDataHash(null);
              setIsDisabled(false);
            }, 3000);
          });
        } else {
          alert("Error while uploading the files");
          console.log("Error while uploading the files");
          setIsDisabled(false);
        }
      } else {
        alert("Cant mint Nft. invalid copy or null file");
        console.log("Cant mint Nft. invalid copy or null file");
        console.log(copies, File);
      }
    } catch (error) {
      alert('Exception thrown while calling mint nft function');
      console.log(error);
    }
  };

  return (
    <>
      <h2 style={{ textAlign: "center" }}>
        logged in address: - {context.account.address}
      </h2>
      <h4 style={{ textAlign: "center" }}>File Hash: {FileHash}</h4>
      <h4 style={{ textAlign: "center" }}>Metadata Hash: {MetaDataHash}</h4>

      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 shadow rounded border border-primary">
            <form className="px-3 py-3" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group mt-4">
                <label htmlFor="name">
                  <b>NFT Name</b>
                </label>
                <input
                  type="text"
                  className="form-control mt-2"
                  id="name"
                  placeholder="name"
                  {...register("name", { required: true })}
                />
                {errors.name && <p style={{ color: "red" }}>Required</p>}
              </div>

              <div className="form-group mt-4">
                <label htmlFor="desc">
                  <b>Description</b>
                </label>
                <input
                  type="text"
                  className="form-control mt-2"
                  id="desc"
                  placeholder="details"
                  {...register("desc", { required: true })}
                />
                {errors.desc && <p style={{ color: "red" }}>Required</p>}
              </div>

              <div className="form-group mt-4">
                <label htmlFor="copies">
                  <b>Copies</b>
                </label>
                <input
                  type="text"
                  className="form-control mt-2"
                  id="copies"
                  placeholder="copies"
                  {...register("copies", { required: true })}
                />
                {errors.copies && <p style={{ color: "red" }}>Required</p>}
              </div>

              <div className="form-group mt-4">
                <label htmlFor="file">
                  <b>Asset</b>
                </label>
                <input
                  type="file"
                  className="form-control form-control-file mt-2"
                  id="file"
                  onChange={handleFileUpload}
                  required
                />
              </div>

              <button
                className="btn btn-primary mt-4 px-4 py-2"
                type="submit"
                disabled={IsDisabled}
              >
                <b>Mint</b>
              </button>
            </form>
          </div>
        </div>
      </div>
      <hr />
      {/* <img src="https://ipfs.io/ipfs/QmYXEZGtq2pSS7ESzSxHvzqWBokqAmwSB6UiEJAzx8CM2u" alt="" /> */}
    </>
  );
}
