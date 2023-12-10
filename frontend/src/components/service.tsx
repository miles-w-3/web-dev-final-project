import { useEffect, useState } from "react";
import { Service } from "../../../shared/types/posts";
import { useParams } from "react-router";
import { getService } from "../clients/post";

function ServicePost() {
  const { serviceId } = useParams();
  const [currentService, setCurrentService] = useState<Service | undefined>();

  useEffect(() => {

    const getCurrentService = async () => {
      if (!serviceId) {
        setCurrentService(undefined);
        return;
      }

      const serviceFromBackend = await getService(serviceId);
    }


  }, [])

  const { serviceId } = useParams();

  return (<></>)

}