import React from "react";
import { Button, Space, DatePicker, Table, Input } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import { loadPsd } from "./main";

const columns = [
  {
    title: "Project Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Star",
    dataIndex: "star",
    key: "star",
  },
  {
    title: "Download",
    dataIndex: "download",
    key: "download",
  },
  {
    title: "Result",
    dataIndex: "result",
    key: "result",
  },
];

const App = () => {
  const [dataSource, setDataSource] = React.useState([
    {
      key: "1",
      name: "psd.js",
      star: "2.7k",
      download: "189",
      result: null,
    },
    {
      key: "2",
      name: "@webtoon/psd",
      star: "471",
      download: "3314",
      result: null,
    },
    {
      key: "3",
      name: "ag-psd",
      star: "1.2k",
      download: "1120",
      result: null,
    },
  ]);

  const props: UploadProps = {
    name: "file",
    accept: ".psd",
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
        loadPsd(info.file.originFileObj).then((canvasArr) => {
          setDataSource((prevDataSource) => {
            return prevDataSource.map((item, index) => {
              const canvas = canvasArr[index];
              return {
                ...item,
                result: canvas,
              };
            });
          });
        });
      }
    },
  };
  return (
    <div style={{ padding: "0 24px" }}>
      <h2>psd parse project compare:</h2>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
      <Table dataSource={dataSource} columns={columns} />;
    </div>
  );
};

export default App;
