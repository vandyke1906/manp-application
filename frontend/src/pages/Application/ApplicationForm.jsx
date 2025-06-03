import React, { useEffect, useRef, useState } from 'react'
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import ComponentCard from '../../components/common/ComponentCard';
import Button from '../../components/ui/button/Button';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import FileInput from '../../components/form/input/FileInput';
import MultipleSelect from '../../components/form/MultipleSelect';
import Select from '../../components/form/Select';
import DatePicker from '../../components/form/DatePicker';
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
  const [applicantTypes, setApplicantTypes] = useState([]);

  const { isLoading, isError, data: result, error, isSuccess } = useQuery({ 
    queryKey: ["application", id],
    queryFn: () => ApiClient.get(`applications/${id}`).then((response) => {
      return response.data;
    }),
    enabled: !!id, // Only run the query if `id` exists
  });

  const { data: appFileresult } = useQuery({ 
    queryKey: ["application-files", id],
    queryFn: () => ApiClient.get(`/files/${folder}/${filename}`).then((response) => {
      console.info({response})
      return response.data;
    }),
    enabled: obj && Object.keys(obj).length > 0, // Only run the query if `id` exists
  });

  console.log(obj);
  
  const userProfileQuery = useQuery({
    queryKey: ["user-profile"],
    queryFn: () => ApiClient.get(`/users/profile`).then((response) => response.data),
  });

  const applicationTypeQuery = useQuery({
    queryKey: ["application-types"],
    queryFn: () => ApiClient.get(`application-types`).then((response) => response.data),
  });

  const applicantTypeQuery = useQuery({
    queryKey: ["applicant-types"],
    queryFn: () => ApiClient.get(`applicant-types`).then((response) => response.data),
  });

  const businessTypeQuery = useQuery({
    queryKey: ["business-types"],
    queryFn: () => ApiClient.get(`business-types`).then((response) => response.data),
  });

  const capitalizationQuery = useQuery({
    queryKey: ["capitalizations"],
    queryFn: () => ApiClient.get(`capitalizations`).then((response) => response.data),
  });
  
  const businessNatureQuery = useQuery({
    queryKey: ["business-natures"],
    queryFn: () => ApiClient.get(`business-natures`).then((response) => response.data),
  });

  const businessStatusQuery = useQuery({
    queryKey: ["business-statuses"],
    queryFn: () => ApiClient.get(`business-statuses`).then((response) => response.data),
  });

  //options
  const applicationTypeOptions = applicationTypeQuery.data?.data?.map((data) => ({
    value: data.id, // Use `id` as the value
    label: data.name, // Use `name` as the label
  })) || [];

  const applicantTypeOptions = applicantTypeQuery.data?.data?.map((data) => ({
    value: data.id, // Use `id` as the value
    label: data.name, // Use `name` as the label
    selected: false
  })) || [];

  const businessTypeOptions = businessTypeQuery.data?.data?.map((data) => ({
    value: data.id, // Use `id` as the value
    label: data.name, // Use `name` as the label
  })) || [];

  const capitalizationOptions = capitalizationQuery.data?.data?.map((data) => ({
    value: data.id, // Use `id` as the value
    label: data.name, // Use `name` as the label
  })) || [];

  const businessNatureOptions = businessNatureQuery.data?.data?.map((data) => ({
    value: data.id, // Use `id` as the value
    label: data.name, // Use `name` as the label
  })) || [];

  const businessStatusOptions = businessStatusQuery.data?.data?.map((data) => ({
    value: data.id, // Use `id` as the value
    label: data.name, // Use `name` as the label
  })) || [];
  

  // Use useEffect to update the state when the query is successful
  useEffect(() => {
    if (isSuccess && result) {
      setObj(result?.data);
    }
  }, [isSuccess, result]);


  const createMutation = useMutation({ 
    mutationFn: (data) => ApiClient.post("applications", data, { headers: {  'Content-Type': 'multipart/form-data' } }).then((response) => response.data),
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
    mutationFn: (data) => ApiClient.put(`applications/${data?.id || 0}`, data, { headers: {  'Content-Type': 'multipart/form-data' } }).then((response) => response.data),
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
    data.applicant_type_id = applicantTypes;
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
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-7">
                  <div className="sm:col-span-2">
                    <Label>
                      First Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="fname"
                      name="fname"
                      placeholder="Enter your first name"
                      isRequired={true}
                      defaultValue={userProfileQuery?.data?.data?.first_name || ""}
                      disabled={true}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Label>
                      Middle Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="mname"
                      name="mname"
                      placeholder="Enter your Middle name"
                      isRequired={true}
                      defaultValue={userProfileQuery?.data?.data?.middle_name || ""}
                      disabled={true}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>
                      Last Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="lname"
                      name="lname"
                      placeholder="Enter your last name"
                      isRequired={true}
                      defaultValue={userProfileQuery?.data?.data?.last_name || ""}
                      disabled={true}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <Label>
                      Suffix
                    </Label>
                    <Input
                      type="text"
                      id="suffix"
                      name="suffix"
                      placeholder="Enter Suffix"
                      hint="Jr. Sr."
                      defaultValue={userProfileQuery?.data?.data?.suffix || ""}
                      disabled={true}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div className="sm:col-span-1">
                    <Label htmlFor="mobile">Mobile Number<span className="text-error-500">*</span></Label>
                    <Input 
                      type="text" id="mobile" name="mobile_number" 
                      placeholder="Mobile Number" 
                      isRequired={true}
                      defaultValue={userProfileQuery?.data?.data?.mobile_number || ""}
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <Label htmlFor="tel">Telephone Number</Label>
                    <Input 
                      type="text" 
                      id="tel" 
                      name="telephone_number" 
                      placeholder="Telphone Number" 
                      defaultValue={userProfileQuery?.data?.data?.telephone_number || ""}
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <Label htmlFor="email">Email Address<span className="text-error-500">*</span></Label>
                    <Input type="email" id="email" 
                      name="emai_address" 
                      placeholder="Email Address" 
                      isRequired={true} 
                      defaultValue={userProfileQuery?.data?.data?.email || ""}
                      disabled={true}
                    />
                  </div>
                </div>

                  <div>
                      <Label htmlFor="address">Address<span className="text-error-500">*</span></Label>
                      <TextArea id="address" rows={3} 
                        name="address" 
                        placeholder="address" 
                        isRequired={true}
                        defaultValue={userProfileQuery?.data?.data?.address || ""}
                      />
                  </div>
              </div>
          </ComponentCard>

          <ComponentCard title="Business / Project Details" className="mt-6">
              <div className="space-y-6">
                 <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <Label htmlFor="business_status">Application Type<span className="text-error-500">*</span></Label>
                      <Select
                        options={applicationTypeOptions}
                        name="application_type_id"
                        placeholder="Select Application Type"
                        className="dark:bg-dark-900"
                        isRequired={true}
                        defaultValue={obj?.application_type_id || ""}
                      />
                    </div>

                    <div className="sm:col-span-1">
                       <DatePicker
                        id="date-picker"
                        name="application_date"
                        label="Application Date"
                        placeholder="Select a date"
                        isRequired={true}
                        defaultDate={obj?.application_date || ""}
                      />
                    </div>
                  </div>


                  <div>
                    <Label htmlFor="business_name">Business Name<span className="text-error-500">*</span></Label>
                    <Input type="text" id="business_name" name="business_name" placeholder="Name of Business" defaultValue={obj?.business_name || ""} />
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div className="sm:col-span-1">
                      <Label htmlFor="business_nature">Nature of Business/Project/Activity<span className="text-error-500">*</span></Label>
                      <Select
                        options={businessNatureOptions}
                        name="business_nature_id"
                        placeholder="Select Option"
                        className="dark:bg-dark-900"
                        defaultValue={obj?.business_nature_id || ""} 
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <MultipleSelect
                        label="Type of Applicant"
                        isRequired={true}
                        options={applicantTypeOptions}
                        onChange={(values) => setApplicantTypes(values)}
                        defaultSelected={obj?.applicant_type_id || []}
                      />
                    </div>
                  </div>

                  <div>
                      <Label htmlFor="business_address">Business Address<span className="text-error-500">*</span></Label>
                      <TextArea id="business_address" rows={3} name="business_address" placeholder="Business Address" defaultValue={obj?.business_address} isRequired={true} />
                  </div>

                   <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <Label htmlFor="business_status">Status of the Business/Project/Activity<span className="text-error-500">*</span></Label>
                      <Select
                        options={businessStatusOptions}
                        id="business_status"
                        name="business_status_id"
                        placeholder="Select Business Status"
                        className="dark:bg-dark-900"
                        isRequired={true}
                        defaultValue={obj?.business_status_id || ""}
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <Label htmlFor="capitalization">Capitalization<span className="text-error-500">*</span></Label>
                      <Select
                        options={capitalizationOptions}
                        id="capitalization"
                        name="capitalization_id"
                        placeholder="Select Capitalization"
                        className="dark:bg-dark-900"
                        isRequired={true}
                        defaultValue={obj?.capitalization_id || ""}
                      />
                    </div>
                  </div>

                   <div>
                      <Label htmlFor="business_description">Brief Description of the Business<span className="text-error-500">*</span></Label>
                      <TextArea id="business_description" rows={6} name="business_description" 
                        placeholder="Brief Description of the Business" 
                        defaultValue={obj?.business_description}
                        hint="Example for Development Projects: The planned project is an inland resort within 1,000 sqm of land beside the road at Sitio Paradise, Brgy. Kapatagan, Digos City, Davao del Sur. The total project footprint is 500 sqm which will include 1 admin building, 1 function hall, 1 swimming pool, and 5 villas/rooms. The projected capacity of the resort is 50 persons per night and 75 day-tour visitors. (Important Note: Please include the size of total land area, and the total area of facilities as the project footprint)"
                        isRequired={true}
                       />
                  </div>
              </div>
          </ComponentCard>


           <ComponentCard title="Required Documents" className="mt-6">
              <div className="space-y-6">
                  <div>
                      <Label htmlFor="proof_of_capitalization">Duly Signed Proof of Capitalization from the LGU<span className="text-error-500">*</span></Label>
                      <FileInput type="file" id="proof_of_capitalization" name="proof_of_capitalization" placeholder="Duly Signed Proof of Capitalization from the LGU" defaultValue={obj?.name} hint="Only PDF or image files (SVG, PNG, JPG, or GIF)" accept="image/*,application/pdf" isRequired={true} />
                  </div>

                  <div>
                      <Label htmlFor="barangay_clearance">Barangay Clearance or Resolution Where the Project<span className="text-error-500">*</span></Label>
                      <FileInput type="file" id="barangay_clearance" name="barangay_clearance" placeholder="Barangay Clearance or Resolution Where the Project" defaultValue={obj?.name} hint="Only PDF or image files (SVG, PNG, JPG, or GIF)" accept="image/*,application/pdf" isRequired={true} />
                  </div>

                  <div>
                      <Label htmlFor="birth_certificate_or_id">Birth Certificate or Valid ID of Proponent<span className="text-error-500">*</span></Label>
                      <FileInput type="file" id="birth_certificate_or_id" name="birth_certificate_or_id" placeholder="Birth Certificate or Valid ID of Proponent" defaultValue={obj?.name} hint="Only PDF or image files (SVG, PNG, JPG, or GIF)" accept="image/*,application/pdf" isRequired={true} />
                  </div>

                   <div>
                      <Label htmlFor="ncip_document">Document Secured from the NCIP<span className="text-error-500">*</span></Label>
                      <FileInput type="file" id="ncip_document" name="ncip_document" placeholder="Document Secured from the NCIP" defaultValue={obj?.name} hint="Only PDF or image files (SVG, PNG, JPG, or GIF)" accept="image/*,application/pdf" isRequired={true} />
                  </div>

                  <div>
                      <Label htmlFor="fpic_certification">Certification from the Barangay IPS Head/ Tribal Chieftain that the Proponent is Complying with the FPIC Process<span className="text-error-500">*</span></Label>
                      <FileInput type="file" id="fpic_certification" name="fpic_certification" placeholder="Certification from the Barangay IPS Head/ Tribal Chieftain that the Proponent is Complying with the FPIC Process" defaultValue={obj?.name} hint="Only PDF or image files (SVG, PNG, JPG, or GIF)" accept="image/*,application/pdf" isRequired={true} />
                  </div>

                  <div>
                      <Label htmlFor="business_permit">DTI Certificate/ SEC Certificate/ Mayor's Business Permit (for Old)<span className="text-error-500">*</span></Label>
                      <FileInput type="file" id="business_permit" name="business_permit" placeholder="DTI Certificate/ SEC Certificate/ Mayor's Business Permit (for Old)" defaultValue={obj?.name} hint="Only PDF or image files (SVG, PNG, JPG, or GIF)" accept="image/*,application/pdf" isRequired={true} />
                  </div>

                   <div>
                      <Label htmlFor="authorization_letter">Authorization Letter duly Signed by the Proponent</Label>
                      <FileInput type="file" id="authorization_letter" name="authorization_letter" placeholder="Authorization Letter duly Signed by the Proponent" defaultValue={obj?.name} hint="Only PDF or image files (SVG, PNG, JPG, or GIF)" accept="image/*,application/pdf"/>
                  </div>

                  {/* test */}
                   <div>
                      {appFileresult?.data?.proof_of_capitalization ? (
                        <a href={appFileresult?.data?.proof_of_capitalization} target="_blank" rel="noopener noreferrer">{appFileresult?.data?.proof_of_capitalization || ""}</a>
                      ) : (
                        <p>No file uploaded</p>
                      )}
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