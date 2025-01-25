"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useActionState } from 'react'
import SubmitButton from '../components/Submitbutton'
import { OnboardUser } from '../actions'
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { OnboardingSchema } from '../utils/zodschema'

const Onboarding = () => {
  const [lastResult, action] = useActionState(OnboardUser, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: OnboardingSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]">
      <Card className="w-[380px] p-6 shadow-2xl rounded-lg bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800 text-center">You Are Almost Finished</CardTitle>
          <CardDescription className="text-sm text-gray-600 text-center">Enter Your Information</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6" action={action} id={form.id} onSubmit={form.onSubmit} noValidate>
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-3 w-full">
                <Label className="text-sm font-medium text-gray-700">First Name</Label>
                <input
                  name={fields.firstName.name}
                  key={fields.firstName.key}
                  defaultValue={fields.firstName.initialValue}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  placeholder="John"
                />
                <p className="text-red-500 text-sm">{fields.firstName.errors}</p>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <Label className="text-sm font-medium text-gray-700">Last Name</Label>
                <input
                  name={fields.lastName.name}
                  key={fields.lastName.key}
                  defaultValue={fields.lastName.initialValue}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  placeholder="Doe"
                />
                <p className="text-red-500 text-sm">{fields.lastName.errors}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <Label className="text-sm font-medium text-gray-700">Address</Label>
              <input
                name={fields.address.name}
                key={fields.address.key}
                defaultValue={fields.address.initialValue}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                placeholder="12th st, NY"
              />
              <p className="text-red-500 text-sm">{fields.address.errors}</p>
            </div>
            <SubmitButton text="Finish Onboarding"variant={"outline"} />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
