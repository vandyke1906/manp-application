import React, { useEffect, useRef, useState } from 'react'
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import ComponentCard from '../../components/common/ComponentCard';
import Button from '../../components/ui/button/Button';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import { useNavigate, useParams } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createZoning, getZoning, updateZoning } from '../../_utils/api/ApiZoning';
import { toast } from 'react-toastify';
import TextArea from '../../components/form/input/TextArea';
import Spinner from '../../components/spinner/Spinner';
import SomethingWentWrong from '../../components/SomethingWentWrong';

import { ApiClient } from '../../_utils/axios';

const ZoningForm = ({title=""}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const formRef = useRef(null);
    const [obj, setObj] = useState({});

  const { isLoading, isError, data: result, error, isSuccess } = useQuery({ 
    queryKey: ["zoning", id], 
    queryFn: () => ApiClient.get(`zonings/${id}`).then((response) => response.data),
    enabled: !!id, // Only run the query if `id` exists
  });

  useEffect(() => {
    if (isSuccess && result) {
      setObj(result?.data);
    }

    if (isError && error?.response?.status === 404) {
      navigate("/zoning"); // Redirect to zoning list or home page
      toast.error("Zoning data not found!", { position: "bottom-right" });
    }
    
  }, [isSuccess, result, isError, error, navigate]);

  const createMutation = useMutation({ 
    mutationFn: (data) => ApiClient.post("zonings", data).then((response) => response.data),
    onError:(error) => console.log({error}),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["zoning"] });
      if(data.success){
        formRef.current.reset();
        toast.success(data.message, { position: "bottom-right", onClose: (reason) => {
          if(!reason) navigate("/zoning");
        } });
      } else {
        toast.error("Zoning Error!", { position: "bottom-right" });
      }
    }
  });

  
    // Mutation for updating
    const updateMutation = useMutation({
      mutationFn: (data) => ApiClient.put(`zonings/${data?.id || 0}`, data).then((response) => response.data),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["businessType"] });
        if(data.success){
          toast.success(data.message, {
            position: "bottom-right",
            onClose: (reason) => {
              if (!reason) navigate("/business-type");
            },
          });
        } else {
          toast.error("Zoning Error!", { position: "bottom-right" });
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
        title="Zoning Classification"
        description=""
    />
    <PageBreadcrumb pageTitle="Zoning Classification" />
    <div className="space-y-6">
        <ComponentCard title={title}>
        <form ref={formRef} onSubmit={handleSave}>
          <div className="space-y-6">
                <div>
                    <Label htmlFor="input">Name</Label>
                    <Input type="text" id="input" name="name" placeholder="Business Type" defaultValue={obj?.name} />
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

export default ZoningForm