import { Button, Result } from "antd";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, this page doesn't exist."
      extra={
        <>
          <Link to="/">
            <Button type="primary">Back to Home</Button>
          </Link>
        </>
      }
    />
  );
};

export default Error;
