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
import { createApplicationType, getApplicationType, updateApplicationType } from '../../_utils/api/ApiApplicationTypes';

const ApplicationTypeForm = ({title=""}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const formRef = useRef(null);
  const [obj, setObj] = useState({});

  const { isLoading, isError, data: result, error, isSuccess } = useQuery({ 
    queryKey: ["applicationType", id],
      queryFn: () => getApplicationType(id),
      enabled: !!id, // Only run the query if `id` exists
    });

  // Use useEffect to update the state when the query is successful
  useEffect(() => {
    if (isSuccess && result) {
      setObj(result?.data);
    }
  }, [isSuccess, result]);


  const createMutation = useMutation({ 
    mutationFn: createApplicationType,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["applicationType"] });
      if(data.success){
        toast.success(data.message, { position: "bottom-right", onClose: (reason) => {
          if(!reason) navigate("/application-type");
        } });
        formRef.current.reset();
      } else {
        toast.error("Application Type Error!", { position: "bottom-right" });
      }
    }
  });

  // Mutation for updating
  const updateMutation = useMutation({
    mutationFn: updateApplicationType,
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["applicationType"] });
      if(data.success){
        toast.success(data.message, {
          position: "bottom-right",
          onClose: (reason) => {
            if (!reason) navigate("/application-type");
          },
        });
      } else {
        toast.error("Application Type Error!", { position: "bottom-right" });
      }
    },
  });


  const handleSave = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target); // Creates a FormData object from the form
    const data = Object.fromEntries(formData.entries()); // Converts FormData to
    
    // Call the correct mutation based on whether an `id` exists
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
        title="Application Type"
        description=""
    />
    <PageBreadcrumb pageTitle="Application Type" />
    <div className="space-y-6">
        <ComponentCard title={title}>
          <form  ref={formRef} onSubmit={handleSave}>
            <div className="space-y-6">
                <div>
                    <Label htmlFor="input">Name</Label>
                    <Input type="text" id="input" name="name" placeholder="Application Type" defaultValue={obj?.name} />
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

export default ApplicationTypeForm