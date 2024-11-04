// FIXME : 데모용이므로 추후 삭제 요망

import { Meta, StoryObj } from "@storybook/react"
import DemoButton from "@/app/components/DemoButton"
import { action } from "@storybook/addon-actions"

const meta = {
  title: "demo/DemoButton",
  component: DemoButton,
} satisfies Meta<typeof DemoButton>

export default meta

type Story = StoryObj<typeof DemoButton>

export const Demo: Story = {
  args: {
    buttonName: "Test Button",
    clickFn: () => {
      action("clickFn")("Clicked!")
    },
  },
}

export const Test: Story = {
  args: {
    buttonName: "Real Test Button!",
    clickFn: () => {
      action("clickFn")("Clicked2222!")
    },
  },
}
