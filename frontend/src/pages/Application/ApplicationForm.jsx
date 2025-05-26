import React, { useEffect, useRef, useState } from 'react'
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import ComponentCard from '../../components/common/ComponentCard';
import Button from '../../components/ui/button/Button';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import FileInput from '../../components/form/input/FileInput';
import { useNavigate, useParams } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import TextArea from '../../components/form/input/TextArea';
import Spinner from '../../components/spinner/Spinner';
import SomethingWentWrong from '../../components/SomethingWentWrong';
import { ApiClient } from '../../_utils/axios';
import Checkbox from '../../components/form/input/Checkbox';

const ApplicationForm = ({title=""}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const formRef = useRef(null);
  const [obj, setObj] = useState({});

  const { isLoading, isError, data: result, error, isSuccess } = useQuery({ 
    queryKey: ["application", id],
      queryFn: () => ApiClient.get(`applications/${id}`).then((response) => response.data),
      enabled: !!id, // Only run the query if `id` exists
    });

  // Use useEffect to update the state when the query is successful
  useEffect(() => {
    if (isSuccess && result) {
      setObj(result?.data);
    }
  }, [isSuccess, result]);


  const createMutation = useMutation({ 
    mutationFn: (data) => ApiClient.post("applications", data).then((response) => response.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["application"] });
      if(data.success){
        formRef.current.reset();
        toast.success(data.message, { position: "bottom-right", onClose: (reason) => {
          if(!reason) navigate("/applications");
        } });
      } else {
        toast.error("Business Type Error!", { position: "bottom-right" });
      }
    }
  });

  // Mutation for updating
  const updateMutation = useMutation({
    mutationFn: (data) => ApiClient.put(`applications/${data?.id || 0}`, data).then((response) => response.data),
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["application"] });
      if(data.success){
        toast.success(data.message, {
          position: "bottom-right",
          onClose: (reason) => {
            if (!reason) navigate("/applications");
          },
        });
      } else {
        toast.error("Application Error!", { position: "bottom-right" });
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
        title="Application"
        description=""
    />
    <PageBreadcrumb pageTitle="Application" />
    <div className="space-y-6">
        <form  ref={formRef} onSubmit={handleSave}>
          <ComponentCard title="Proponent Details">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div className="sm:col-span-1">
                    <Label>
                      First Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="fname"
                      name="fname"
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <Label>
                      Middle Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="fname"
                      name="fname"
                      placeholder="Enter your Middle name"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <Label>
                      Last Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="lname"
                      name="lname"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div className="sm:col-span-1">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input type="text" id="mobile" name="name" placeholder="Mobile Number" defaultValue={obj?.name} />
                  </div>

                  <div className="sm:col-span-1">
                    <Label htmlFor="tel">Telephone Number</Label>
                    <Input type="text" id="tel" name="telephone_number" placeholder="Telphone Number" defaultValue={obj?.name} />
                  </div>

                  <div className="sm:col-span-1">
                    <Label htmlFor="email">Email Address</Label>
                    <Input type="email" id="email" name="emai_address" placeholder="Email Address" isRequired={true} defaultValue={obj?.name} />
                  </div>
                </div>

                  <div>
                      <Label htmlFor="address">Address</Label>
                      <TextArea id="address" rows={3} name="address" placeholder="address" defaultValue={obj?.description} />
                  </div>
              </div>
          </ComponentCard>

          <ComponentCard title="Business / Project Details" className="mt-6">
              <div className="space-y-6">
                  <div>
                      <Label htmlFor="mobile">Business Name</Label>
                      <Input type="text" id="mobile" name="name" placeholder="Name of Business" defaultValue={obj?.name} />
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <Label htmlFor="tel">Nature of Business</Label>
                      <Input type="text" id="tel" name="telephone_number" placeholder="Nature of Business" defaultValue={obj?.name} />
                    </div>

                    <div className="sm:col-span-1">
                      <Label htmlFor="mobile">Type of Applicant</Label>
                      <Input type="text" id="mobile" name="name" placeholder="Name of Business" defaultValue={obj?.name} />
                    </div>
                  </div>

                  <div>
                      <Label htmlFor="address">Business Address</Label>
                      <TextArea id="address" rows={3} name="address" placeholder="Business Address" defaultValue={obj?.description} />
                  </div>

                   <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <Label htmlFor="tel">Business Status</Label>
                      <Input type="text" id="tel" name="telephone_number" placeholder="Telphone Number" defaultValue={obj?.name} />
                    </div>

                    <div className="sm:col-span-1">
                      <Label htmlFor="tel">Capitalization</Label>
                      <Input type="text" id="tel" name="telephone_number" placeholder="Telphone Number" defaultValue={obj?.name} />
                    </div>
                  </div>

                   <div>
                      <Label htmlFor="address">Brief Description of the Business</Label>
                      <TextArea id="address" rows={6} name="business_description" placeholder="Brief Description of the Business" defaultValue={obj?.description} />
                  </div>
              </div>
          </ComponentCard>


           <ComponentCard title="Required Documents" className="mt-6">
              <div className="space-y-6">
                  <div>
                      <Label htmlFor="mobile">Duly Signed Proof of Capitalization from the LGU</Label>
                      <FileInput type="file" id="tel" name="telephone_number" placeholder="Telphone Number" defaultValue={obj?.name} hint="Only PDF or image files (SVG, PNG, JPG, or GIF)" accept="image/*,application/pdf"/>
                  </div>

                  <div>
                      <Label htmlFor="mobile">Barangay Clearance or Resolution Where the Project</Label>
                      <FileInput type="file" id="tel" name="telephone_number" placeholder="Telphone Number" defaultValue={obj?.name} hint="Only PDF or image files (SVG, PNG, JPG, or GIF)" accept="image/*,application/pdf"/>
                  </div>

                  <div>
                      <Label htmlFor="mobile">Birth Certificate or Valid ID of Proponent</Label>
                      <FileInput type="file" id="tel" name="telephone_number" placeholder="Telphone Number" defaultValue={obj?.name} hint="Only PDF or image files (SVG, PNG, JPG, or GIF)" accept="image/*,application/pdf"/>
                  </div>

                   <div>
                      <Label htmlFor="mobile">Document Secured from the NCIP</Label>
                      <FileInput type="file" id="tel" name="telephone_number" placeholder="Document Secured from the NCIP" defaultValue={obj?.name} hint="Only PDF or image files (SVG, PNG, JPG, or GIF)" accept="image/*,application/pdf"/>
                  </div>

                  <div>
                      <Label htmlFor="mobile">Certification from the Barangay IPS Head/ Tribal Chieftain that the Proponent is Complying with the FPIC Process</Label>
                      <FileInput type="file" id="tel" name="telephone_number" placeholder="Certification from the Barangay IPS Head/ Tribal Chieftain that the Proponent is Complying with the FPIC Process" defaultValue={obj?.name} hint="Only PDF or image files (SVG, PNG, JPG, or GIF)" accept="image/*,application/pdf"/>
                  </div>

                  <div>
                      <Label htmlFor="mobile">DTI Certificate/ SEC Certificate/ Mayor's Business Permit (for Old)</Label>
                      <FileInput type="file" id="tel" name="telephone_number" placeholder="DTI Certificate/ SEC Certificate/ Mayor's Business Permit (for Old)" defaultValue={obj?.name} hint="Only PDF or image files (SVG, PNG, JPG, or GIF)" accept="image/*,application/pdf"/>
                  </div>

                   <div>
                      <Label htmlFor="mobile">Authorization Letter duly Signed by the Proponent</Label>
                      <FileInput type="file" id="tel" name="telephone_number" placeholder="Authorization Letter duly Signed by the Proponent" defaultValue={obj?.name} hint="Only PDF or image files (SVG, PNG, JPG, or GIF)" accept="image/*,application/pdf"/>
                  </div>
              </div>
          </ComponentCard>

          
          <div className="flex items-center gap-3 mt-6">
            <Checkbox
              className="w-5 h-5"
              checked={true}
               onChange={() => {}}
            />
            <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
              By checking this box, I confirm that all information provided in this form is complete, accurate, and truthful to the best of my knowledge. I acknowledge that any misrepresentation or false information may result in the deferral or cancellation of my application or clearance issued. By proceeding, I also agree to the {" "}
              <span className="text-gray-800 dark:text-white/90">
                Terms and Conditions,
              </span>{" "}
              and the{" "}
              <span className="text-gray-800 dark:text-white">
                Privacy Policy
              </span>{" "}
              related to this application.
            </p>
          </div>
              
          <div className="flex mt-6">
            <div className="mr-4">
              <Button size="sm" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
            <div>
              <Button size="sm" variant="primary" type="submit">
                Submit Application
              </Button>
            </div>
          </div>

        </form>
    </div>
    </>
  )
}

export default ApplicationForm