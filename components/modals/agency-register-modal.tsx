"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AgencyRegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onRegister: (agency: any) => void
}

export default function AgencyRegisterModal({ isOpen, onClose, onRegister }: AgencyRegisterModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    tin: "",
    businessName: "",
    agreement: "Monthly",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleAgreementChange = (value: string) => {
    setFormData({ ...formData, agreement: value })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.tin.trim()) {
      newErrors.tin = "TIN is required"
    } else if (!/^\d{9}$/.test(formData.tin)) {
      newErrors.tin = "TIN must be a 9-digit number"
    }

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onRegister(formData)
      setFormData({
        firstName: "",
        lastName: "",
        tin: "",
        businessName: "",
        agreement: "Monthly",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Register New Agency</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tin">TIN (Tax Identification Number)</Label>
              <Input
                id="tin"
                name="tin"
                value={formData.tin}
                onChange={handleChange}
                className={errors.tin ? "border-red-500" : ""}
              />
              {errors.tin && <p className="text-xs text-red-500">{errors.tin}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className={errors.businessName ? "border-red-500" : ""}
              />
              {errors.businessName && <p className="text-xs text-red-500">{errors.businessName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="agreement">Agreement Type</Label>
              <Select value={formData.agreement} onValueChange={handleAgreementChange}>
                <SelectTrigger id="agreement">
                  <SelectValue placeholder="Select agreement type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="Annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Register</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
