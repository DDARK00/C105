import { useMutation, useStorage } from "@liveblocks/react";
import MDEditor from "@uiw/react-md-editor";
import mermaid from "mermaid";
import { Children, isValidElement, useEffect, useRef } from "react";
import LoadingSpinner from "../common/LoadingSpinner";

// Markdown에서 코드를 추출하는 함수
const getCode = (arr = []) =>
  Children.toArray(arr)
    ?.map((dt) => {
      if (typeof dt === "string") {
        return dt;
      }
      if (isValidElement(dt) && dt.props && dt.props.children) {
        return getCode(dt.props.children);
      }
      return false;
    })
    .filter(Boolean)
    .join("");

// Mermaid 코드 렌더링을 위한 Code 컴포넌트
function Code({ inline, children = [], className, ...props }) {
  const demoid = useRef(
    `dome${parseInt(String(Math.random() * 1e15), 10).toString(36)}`
  );
  const code = getCode(children);
  // console.log("Extracted code:", code);

  const demo = useRef(null);

  useEffect(() => {
    const renderMermaid = async () => {
      if (demo.current && code) {
        try {
          const { svg } = await mermaid.render(demoid.current, code);
          demo.current.innerHTML = svg;
        } catch (error) {
          demo.current.innerHTML = "Invalid syntax";
        }
      }
    };
    renderMermaid();
  }, [code]);
  if (
    typeof code === "string" &&
    typeof className === "string" &&
    /^language-mermaid/.test(className.toLowerCase())
  ) {
    return (
      <div ref={demo}>
        <div id={demoid.current} style={{ display: "none" }} />
      </div>
    );
  }
  return <code className={String(className)}>{children}</code>;
}

function ProposalEditor() {
  const storage = useStorage((root) => root.proposal);

  // const [markdown, setMarkdown] = useState(
  //   `\# MARKDOWN\n \#\# 문법을\n \#\#\# 사용해서\n \#\#\#\# 기획서를 작성하세요.`
  // );

  const updateMarkdown = useMutation(({ storage }, value) => {
    storage.set("proposal", value);
    // const proposal = storage.get("proposal");
    // console.log(proposal);
    // proposal.set(value);
  }, []);

  if (!storage) {
    return (
      <LoadingSpinner
        message={"기획서를 로드 중입니다. 잠시만 기다려주세요!"}
      />
    );
  }

  return (
    <>
      <div className="h-full w-full flex flex-col">
        <div className="flex-1 w-full h-full p-4 bg-gray-100">
          <MDEditor
            value={storage}
            onChange={updateMarkdown}
            textareaProps={{
              placeholder: "Mermaid 문법을 사용해 기획서를 작성하세요.",
            }}
            height={675}
            previewOptions={{
              components: {
                code: Code,
              },
            }}
          />
        </div>
      </div>
    </>
  );
}

export default ProposalEditor;
