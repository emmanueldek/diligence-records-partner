import { getShareHolderDetails } from "@/services/watchlistServices";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import useGetShareHolder from "@/store/useGetShareHolder";
import { TiArrowBack } from "react-icons/ti";
import notFound from "@/assets/images/notFound.png";
import { RingLoader } from "react-spinners";
import { useEffect } from "react";

const ShareHolders = () => {
  const shareHolderId = useParams().shareHolder;
  const { currentUrl } = useGetShareHolder();
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();

  //   const unslugify = (str: string | undefined) => {
  //     return (
  //       str &&
  //       str
  //         .replace(/-/g, " ")
  //         .split(" ")
  //         .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  //         .join(" ")
  //     );
  //   };

  //   const id = unslugify(shareHolderId);

  const { data, isFetching } = useQuery(["shareholder", shareHolderId], () =>
    getShareHolderDetails({ id: shareHolderId }),
  );
  console.log(data);

  useEffect(() => {
    // Cleanup function to invalidate queries when component unmounts or before navigation
    return () => {
      queryClient.invalidateQueries(["shareholder", shareHolderId]);
    };
  }, [queryClient, shareHolderId]);

  useEffect(() => {
    if (data) {
      if (
        data?.data?.profile?.organizationName &&
        !data?.data?.profile?.executiveName
      ) {
        navigate(`/home/organisation/${data.data._id}`);
      } else if (data?.data?.profile?.executiveName) {
        navigate(`/home/executive/${data.data._id}`);
      }
      // No else needed if no action is required for other cases
    }
  }, [data, navigate]);

  useEffect(() => {
    // This function will be called every time the location changes
    const invalidateShareholderData = () => {
      queryClient.invalidateQueries(["shareholder"]);
    };

    invalidateShareholderData();
  }, [location, queryClient]);
  return (
    <div>
      {isFetching ? (
        <div className="w-full h-screen flex justify-center items-center">
          <RingLoader />
        </div>
      ) : (
        <div className="p-5">
          <Link
            to={currentUrl}
            className="flex items-center gap-2 mb-8 cursor-pointer"
          >
            <TiArrowBack size={20} />
            Go Back
          </Link>
          {data?.data === null ? (
            <div className="coming-soon-container flex justify-center items-center h-screen flex-col">
              <img src={notFound} alt="Coming Soon" className="w-[200px]" />
              <p className="text-center">
                We have no information on this Shareholder. <br /> Check back
                later!
              </p>
            </div>
          ) : (
            <div>
              <div className="flex gap-10 items-center border-b border-grey-200 pb-10">
                <div className="w-60 h-60 overflow-hidden rounded-full">
                  <img
                    src={data?.data?.profile?.executiveAvatar}
                    alt="profile_image"
                    className="w-80"
                  />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-3xl font-semibold">
                    {data?.data?.profile?.executiveName}
                  </h1>
                  <p className="text-xl">
                    {data?.data?.profile?.executivePosition}
                  </p>
                  <p className="text-xl">
                    {data?.data?.profile?.organizationName}
                  </p>
                </div>
              </div>
              <div className="py-8">
                <p className="text-[1.1em]">
                  {data?.data?.profile?.executiveDescription}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShareHolders;
