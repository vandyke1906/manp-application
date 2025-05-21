import React, { useEffect, useRef, useState } from 'react'
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import ComponentCard from '../../components/common/ComponentCard';
import Button from '../../components/ui/button/Button';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import Select from '../../components/form/Select';
import TextArea from '../../components/form/input/TextArea';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchBusinessTypes } from '../../_utils/api/ApiBusinessTypes';
import { fetchZoning } from '../../_utils/api/ApiZoning';
import { useNavigate, useParams } from 'react-router';
import { createProponent, updateProponent, getProponent } from '../../_utils/api/ApiProponent';
import Spinner from '../../components/spinner/Spinner';
import SomethingWentWrong from '../../components/SomethingWentWrong';

import { ApiClient } from '../../_utils/axios';

const ProponentForm = ({title=""}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const formRef = useRef(null);
  const [obj, setObj] = useState({});

  const { isLoading, isError, data: result, error, isSuccess } = useQuery({ 
    queryKey: ["proponent", id],
    queryFn: () => ApiClient.get(`propponents/${id}`).then((response) => response.data),
    enabled: !!id, // Only run the query if `id` exists
  });

  const zoningQuery = useQuery({
    queryKey: ["zonings"],
    queryFn: () => ApiClient.get(`zonings`).then((response) => response.data),
  });

  const businessTypeQuery = useQuery({
    queryKey: ["businessTypes"],
    queryFn: () => ApiClient.get(`business-types`).then((response) => response.data),
  });

    useEffect(() => {
      if (isSuccess && result) {
        setObj(result?.data);
      }
    }, [isSuccess, result]);

  // Transform the zoning data into options
  const zoningOptions = zoningQuery.data?.data?.map((zoning) => ({
    value: zoning.id, // Use `id` as the value
    label: zoning.name, // Use `name` as the label
  })) || [];

  // Transform the business type data into options
  const businessTypeOptions = businessTypeQuery.data?.data?.map((businessType) => ({
    value: businessType.id, // Use `id` as the value
    label: businessType.name, // Use `name` as the label
  })) || [];

  const createMutation = useMutation({ 
    mutationFn: (data) => ApiClient.post("proponents", data).then((response) => response.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["proponent"] });
      if(data.success){
        formRef.current.reset();
        toast.success(data.message, { position: "bottom-right", onClose: (reason) => {
          if(!reason) navigate("/proponent");
        } });
      } else {
        toast.error("Proponent Error!", { position: "bottom-right" });
      }
    }
  });

  // Mutation for updating
  const updateMutation = useMutation({
    mutationFn: (data) => ApiClient.put(`proponents/${data?.id || 0}`, data).then((response) => response.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["proponent"] });
      console.info({data});
      if(data.success){
        toast.success(data.message, {
          position: "bottom-right",
          onClose: (reason) => {
            if (!reason) navigate("/proponent");
          },
        });
      } else {
        toast.error("Proponent Error!", { position: "bottom-right" });
      }
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target); // Creates a FormData object from the form
    const data = Object.fromEntries(formData.entries()); // Converts FormData to

    if (id) {
      updateMutation.mutate({ id, ...data }); // Include `id` for the update call
    } else {
      createMutation.mutate(data);
    }
  }


  if(isLoading) return <Spinner />;
  if(isError) return <SomethingWentWrong />;

  return (
    <>
        <PageMeta
        title="Proponent"
        description=""
    />
    <PageBreadcrumb pageTitle="Proponent" />
    <div className="space-y-6">
        <ComponentCard title={title}>
        <form ref={formRef} onSubmit={handleSubmit}>
        <div className="space-y-6">
            <div>
                <Label htmlFor="_name">Name</Label>
                <Input type="text" id="_name" name="name" placeholder="Proponent Name"  defaultValue={obj?.name} isRequired={true} />
            </div>
            <div>
                <Label htmlFor="_estName">Establishment Name</Label>
                <Input type="text" id="_estName" name="establishment" placeholder="Establishment Name"  defaultValue={obj?.establishment} isRequired={true} />
            </div>
            <div>
                <Label htmlFor="_email">Email Address</Label>
                <Input type="email" id="_email" name="email_address" placeholder="Email Address"  defaultValue={obj?.email_address} />
            </div>
            <div>
                <Label htmlFor="_contact">Contact Number</Label>
                <Input type="text" id="_contact" name="contact_number" placeholder="Contact Number"  defaultValue={obj?.contact_number} />
            </div>
            <div>
                <Label htmlFor="_address">Address</Label>
                <TextArea rows={3} error onChange={(value) => {}} name="address" placeholder="Address"  defaultValue={obj?.address} />
            </div>
            <div>
                <Label htmlFor="_areaOcc">Area Occupied</Label>
                <Input type="text" id="_areaOcc" name="area_occupied" placeholder="Area Occupied"  defaultValue={obj?.area_occupied} />
            </div>
            <div>
                <Label htmlFor="_capDec">Capital Declaration</Label>
                <Input type="text" id="_capDec" name="capital_declaration" placeholder="Capital Declaration"  defaultValue={obj?.capital_declaration} />
            </div>
            <div>
              <Label>Business Type</Label>
              <Select
                options={businessTypeOptions}
                name="business_type_id"
                placeholder="Select an option"
                className="dark:bg-dark-900"
                defaultValue={obj?.business_type_id} 
                isRequired={true}
              />
            </div>
            <div>
              <Label>Zoning Classification</Label>
              <Select
                options={zoningOptions}
                name="zoning_id"
                placeholder="Select an option"
                className="dark:bg-dark-900"
                defaultValue={obj?.zoning_id}
                isRequired={true}
              />
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

export default ProponentForm