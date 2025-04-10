"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SkipForward, Pause, Play, Trash2, PlusCircle, Upload } from "lucide-react"
import type { Subscription } from "@/lib/types"

interface SubscriptionActionsProps {
  subscription: Subscription
  onSkipDelivery: () => void
  onPauseResume: () => void
  onCancel: () => void
  onManageProducts: () => void
  onUploadFile: () => void
}

export function SkipDeliveryDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Skip Next Delivery</DialogTitle>
          <DialogDescription>
            Are you sure you want to skip your next delivery? Your next delivery will be scheduled for the following
            month.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
          >
            Confirm Skip
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function SubscriptionActions({
  subscription,
  onSkipDelivery,
  onPauseResume,
  onCancel,
  onManageProducts,
  onUploadFile,
}: SubscriptionActionsProps) {
  const [isSkipOpen, setIsSkipOpen] = useState(false)
  const [isPauseOpen, setIsPauseOpen] = useState(false)
  const [isCancelOpen, setIsCancelOpen] = useState(false)

  return (
    <div className="space-y-4">
      <SkipDeliveryDialog open={isSkipOpen} onOpenChange={setIsSkipOpen} onConfirm={onSkipDelivery} />

      <Dialog open={isPauseOpen} onOpenChange={setIsPauseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{subscription.status === "paused" ? "Resume Subscription" : "Pause Subscription"}</DialogTitle>
            <DialogDescription>
              {subscription.status === "paused"
                ? "Are you ready to resume your subscription? Your next delivery will be scheduled based on your subscription plan."
                : "Are you sure you want to pause your subscription? You won't receive any deliveries until you resume."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPauseOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onPauseResume()
                setIsPauseOpen(false)
              }}
            >
              {subscription.status === "paused" ? "Resume Subscription" : "Pause Subscription"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelOpen(false)}>
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onCancel()
                setIsCancelOpen(false)
              }}
            >
              Cancel Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 gap-3">
        <Button variant="outline" className="w-full justify-start" onClick={() => setIsSkipOpen(true)}>
          <SkipForward className="h-4 w-4 mr-2" />
          Skip Next Delivery
        </Button>

        <Button variant="outline" className="w-full justify-start" onClick={() => setIsPauseOpen(true)}>
          {subscription.status === "paused" ? (
            <>
              <Play className="h-4 w-4 mr-2" />
              Resume Subscription
            </>
          ) : (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Pause Subscription
            </>
          )}
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start text-red-500 hover:text-red-600"
          onClick={() => setIsCancelOpen(true)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Cancel Subscription
        </Button>

        <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700" onClick={onManageProducts}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Manage Products
        </Button>

        <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700" onClick={onUploadFile}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Products File
        </Button>
      </div>
    </div>
  )
}

