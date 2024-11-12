import { createStandaloneToast } from '@chakra-ui/react'

const { toast } = createStandaloneToast()

export const showToast = (message, status = 'error') => {
  toast({
    title: message,
    status,
    duration: 3000,
    isClosable: true,
  })
}
