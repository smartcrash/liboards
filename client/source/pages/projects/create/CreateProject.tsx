import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useCreateBoardMutation } from "../../../generated/graphql";

export const CreateProject = () => {
  const [{ data, fetching }, createBoard] = useCreateBoardMutation();

  useEffect(() => {
    createBoard();
  }, []);

  if (fetching) return <>loading...</>;
  else if (data?.board) return <Navigate to={`/p/${data.board.id}`} replace />;
  return <>Something went wrong :o</>;
};
