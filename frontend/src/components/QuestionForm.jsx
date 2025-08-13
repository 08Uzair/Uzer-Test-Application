import React from "react";
import CategoryQuestion from "./CategoryQuestion";
import ClozeQuestion from "./ClozeQuestion";
import PassageQuestion from "./PassageQuestion";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
const QuestionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // console.log(id, "This is the parentID");
  return (
    <>
      <div className="h-[5vh] w-full">
        <button
          onClick={() => navigate("/dashboard")}
          className="absolute left-0 px-5 py-2 border border-blue-500 mt-4 ml-8 text-lg text-blue-500 gap-2 rounded-md shadow hover:bg-blue-50 transition-all cursor-pointer flex items-center justify-center"
        >
          <ArrowLeft /> Back
        </button>
      </div>
      <div className="flex items-center justify-center flex-col w-full">
        {/* <h1 className="flex items-center justify-center text-center p-2 m-2  bg-blue-100  w-full">
        CATEGORY TYPE QUESTIONS
      </h1> */}
        <CategoryQuestion parentId={id} />
        {/* <h1 className="flex items-center justify-center text-center p-2 m-2  bg-blue-100  w-full">
        CLOZE TYPE QUESTIONS
      </h1> */}
        <ClozeQuestion parentId={id} />
        {/* <h1 className="flex items-center justify-center text-center p-2 m-2  bg-blue-100  w-full">
        PASSAGE TYPE QUESTIONS
      </h1> */}
        <PassageQuestion parentId={id} />
      </div>
    </>
  );
};

export default QuestionForm;
