import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useCreateBoardMutation } from "../../../generated/graphql";
import { route } from "../../../routes";

export const CreateProject = () => {
  const [{ data, fetching }, createBoard] = useCreateBoardMutation();

  useEffect(() => {
    createBoard();
  }, []);

  if (fetching) return <>loading...</>;
  else if (data?.board)
    return (
      <Navigate to={route("projects.show", { id: data.board.id })} replace />
    );
  return <>Something went wrong :o</>;
};
