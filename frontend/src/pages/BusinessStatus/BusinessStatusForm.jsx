import React, { useEffect, useRef, useState } from 'react'
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import ComponentCard from '../../components/common/ComponentCard';
import Button from '../../components/ui/button/Button';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import { useNavigate, useParams } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import TextArea from '../../components/form/input/TextArea';
import Spinner from '../../components/spinner/Spinner';
import SomethingWentWrong from '../../components/SomethingWentWrong';

import { ApiClient } from '../../_utils/axios';

const BusinessStatusForm = ({title=""}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const formRef = useRef(null);
  const [obj, setObj] = useState({});

  const { isLoading, isError, data: result, error, isSuccess } = useQuery({ 
    queryKey: ["business-status", id], 
    queryFn: () => ApiClient.get(`business-statuses/${id}`).then((response) => response.data),
    enabled: !!id, // Only run the query if `id` exists
  });

  useEffect(() => {
    if (isSuccess && result) {
      setObj(result?.data);
    }

    if (isError && error?.response?.status === 404) {
      navigate("/business-status"); // Redirect to business-status list or home page
      toast.error("Status of Business data not found!", { position: "bottom-right" });
    }
    
  }, [isSuccess, result, isError, error, navigate]);

  const createMutation = useMutation({ 
    mutationFn: (data) => ApiClient.post("business-statuses", data).then((response) => response.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["business-status"] });
      if(data.success){
        formRef.current.reset();
        toast.success(data.message, { position: "bottom-right" });
      } else {
        toast.error("Status of Business Error!", { position: "bottom-right" });
      }
    }
  });

  
    // Mutation for updating
    const updateMutation = useMutation({
      mutationFn: (data) => ApiClient.put(`business-statuses/${data?.id || 0}`, data).then((response) => response.data),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["business-status"] });
        if(data.success){
          toast.success(data.message, {
            position: "bottom-right",
            onClose: (reason) => {
              if (!reason) navigate("/business-status");
            },
          });
        } else {
          toast.error("Status of Business Error!", { position: "bottom-right" });
        }
      },
    });

  const handleSave = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target); // Creates a FormData object from the form
    const data = Object.fromEntries(formData.entries()); // Converts FormData to
    
    if (id) {
      updateMutation.mutate({ id, ...data }); // Include `id` for the update call
    } else {
      createMutation.mutate(data);
    }
  };


  if(isLoading) return <Spinner />;
  if(isError) return <SomethingWentWrong />;

  return (
    <>
        <PageMeta
        title="Status of Business"
        description=""
    />
    <PageBreadcrumb pageTitle="Status of Business" />
    <div className="space-y-6">
        <ComponentCard title={title}>
        <form ref={formRef} onSubmit={handleSave}>
          <div className="space-y-6">
                <div>
                    <Label htmlFor="input">Name</Label>
                    <Input type="text" id="input" name="name" placeholder="Status of Business" defaultValue={obj?.name} />
                </div>
                <div>
                    <Label htmlFor="inputTwo">Description</Label>
                    <TextArea id="inputTwo" rows={3} name="description" placeholder="description" defaultValue={obj?.description} />
                </div>
                  <div className="flex">
                    <div className="mr-4">
                    <Button size="sm" variant="outline" onClick={() => navigate(-1)}>
                      Cancel
                    </Button>
                  </div>
                  <div>
                    <Button size="sm" variant="primary" type="submit">
                      Save
                    </Button>
                  </div>
                </div>
          </div>
          </form>
        </ComponentCard>
    </div>
    </>
  )
}

export default BusinessStatusForm