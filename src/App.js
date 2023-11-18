import axios from "axios";
import { useState } from "react";
import "./App.css";

function App() {
  const [filesToSend, setFilesToSend] = useState([]);
  const handleFile = (fileList) => {
    // Array.from(fileList).some(f => {

    // })
    const hasWrongFile = Array.from(fileList).some((f) => {
      return !f.name.endsWith(".docx");
    });
    if (hasWrongFile) {
      alert("docx 형식의 파일만 업로드하세요~!");
      return;
    }
    setFilesToSend(fileList);
  };
  const [creating, setCreating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  return (
    <div
      className="App"
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDragEnd={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {creating && <div className="cr">생성중..</div>}
      <input
        id="myInput"
        type="file"
        multiple
        onChange={(e) => {
          console.log("e.currentTarget.files", e.currentTarget.files);
          handleFile(e.currentTarget.files);
        }}
      />

      <label htmlFor="myInput">파일고르기</label>
      <div
        className={`box ${isDragging ? "dragging" : ""}`}
        // onDrag={(e) => {
        //   e.preventDefault()
        // }}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleFile(e.dataTransfer.files);
          setIsDragging(false);
        }}
        onDragEnd={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log(e.currentTarget.files);
        }}
      >
        {!Boolean(Array.from(filesToSend).length) && (
          <div className="msg">
            <div>docx형식의 파일들을 드래그 하거나 파일 고르기 버튼을 클릭하세요.</div>
          </div>
        )}
        <div className="names">
          {filesToSend &&
            Array.from(filesToSend).map((f) => {
              return <div>{f.name}</div>;
            })}
        </div>
      </div>

      <button
        disabled={!Boolean(Array.from(filesToSend).length)}
        className="submit-btn"
        onClick={async () => {
          setCreating(true);
          try {
            const formData = new FormData();
            formData.append("files", filesToSend);
            // let axiosConfig = {
            //   headers: {
            //     // "Content-Type": "multipart/form-data",
            //     "Content-Type": "fil",
            //   },
            // };
            const url2 =
              process.env.SERVER_URL ||
              "https://port-0-my-flask-app2-3yl7k2blou5evh4.sel5.cloudtype.app";
            const res = await axios.post(`${url2}/api/my`, filesToSend, {
              responseType: "blob",
            });
            const url = window.URL.createObjectURL(res.data);
            const a = document.createElement("a");
            a.href = url;
            a.download = "지원자목록생성.xlsx";
            document.body.appendChild(a);
            a.click();
            console.log("res", res.data);
          } catch (err) {
            alert("에러가 발생했습니다.. 성호한테 전화하세요");
            console.log("got some err");
            console.log(err);
          } finally {
            setCreating(false);
          }
        }}
      >
        엑셀생성
      </button>
    </div>
  );
}

export default App;
