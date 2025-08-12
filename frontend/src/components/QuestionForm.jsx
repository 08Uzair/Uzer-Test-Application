import React from "react";
import CategoryQuestion from "./CategoryQuestion";
import ClozeQuestion from "./ClozeQuestion";
import PassageQuestion from "./PassageQuestion";
import { useParams } from "react-router-dom";

const QuestionForm = () => {
  const { id } = useParams();
  // console.log(id, "This is the parentID");
  return (
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
  );
};

export default QuestionForm;
