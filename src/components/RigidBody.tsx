import {
  PhysicsBody,
  colliderFromElement,
  elementScreenPosition,
  r,
  toRad,
  usePhysics,
} from "@/context/Physics";
import { Slot } from "@radix-ui/react-slot";
import {
  ForwardRefComponent,
  HTMLMotionProps,
  MotionValue,
  isMotionComponent,
  motion,
  motionValue,
} from "framer-motion";
import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

type MotionComponentProps = Parameters<typeof motion.div>[0];

interface RigidBodyBaseProps {
  delay?: number;
  initialRotation?: number;
  bodyType?: "dynamic" | "fixed";

  mass?: number;

  restitution?: number;
  resitutionCombineRule?: r.CoefficientCombineRule;

  friction?: number;
  frictionCombineRule?: r.CoefficientCombineRule;

  collisionGroups?: number;
}

type ChildRenderFuntion = (
  initialize: () => void,
  onResize: () => void
) => React.ReactNode;

interface RigidBodyAsChild {
  asChild: true;
  children: React.ReactNode | ChildRenderFuntion;
}

interface RigidBodyAsDiv extends Omit<MotionComponentProps, "ref"> {
  asChild?: false;
}

type RigidBodyProps = RigidBodyBaseProps & (RigidBodyAsChild | RigidBodyAsDiv);

export type RigidBodyControl = {
  initialize: () => void;
  onResize: () => void;
};
export type RigidBodyControlRef = ForwardedRef<RigidBodyControl>;

export const RigidBody = forwardRef<RigidBodyControl, RigidBodyProps>(
  (
    {
      children,
      asChild = false,
      delay = 0,
      bodyType = "fixed",
      initialRotation = 0,
      mass = 10,
      restitution = 0.5,
      collisionGroups = 0x00020003,
      friction = 0.5,
      frictionCombineRule = r.CoefficientCombineRule.Average,
      resitutionCombineRule = r.CoefficientCombineRule.Average,
      ...props
    }: RigidBodyProps,
    controlRef
  ) => {
    /**
     * in case of child render function, we don't want to initialize physics body on mount
     * it's up to child to initialize it (e.g. wait for image to load and then initialize
     * physics body since we don't know the true size of the image beforehand)
     */
    const intializeOnMount = typeof children === "function" ? false : true;

    // check if child is motion since we are animating it via motion values
    if (
      !isMotionComponent((children as any)?.type) &&
      asChild &&
      intializeOnMount
    ) {
      throw new Error("RigidBody child must be motion component");
    }

    const Comp = asChild
      ? (Slot as ForwardRefComponent<HTMLDivElement, HTMLMotionProps<"div">>)
      : motion.div;

    const [motionValues, setMotionValues] = useState<{
      x: MotionValue<number>;
      y: MotionValue<number>;
      rotateZ: MotionValue<number>;
    }>({
      x: motionValue(0),
      y: motionValue(0),
      rotateZ: motionValue(0),
    });

    useImperativeHandle(controlRef, () => {
      return {
        initialize: () => {
          intializePhysicsBody();
        },
        onResize: () => {
          console.warn("onResize not implemented");
        },
      };
    });

    const physicsBodyRef = useRef<PhysicsBody | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    const { bodies, rapier, world } = usePhysics();

    useEffect(() => {
      if (physicsBodyRef.current) {
        physicsBodyRef.current.rigidBody.collider(0).setMass(mass);
        physicsBodyRef.current.rigidBody
          .collider(0)
          .setRestitution(restitution);
        physicsBodyRef.current.rigidBody.collider(0).setFriction(friction);
        physicsBodyRef.current.rigidBody
          .collider(0)
          .setFrictionCombineRule(frictionCombineRule);
        physicsBodyRef.current.rigidBody
          .collider(0)
          .setRestitutionCombineRule(resitutionCombineRule);
      }
    }, [mass, restitution, friction]);

    const intializePhysicsBody = () => {
      if (ref.current && !physicsBodyRef.current) {
        const screenPosition = elementScreenPosition(ref.current);

        let bodyDesc;
        if (bodyType === "dynamic" && delay === 0) {
          bodyDesc = rapier.RigidBodyDesc.dynamic().setTranslation(
            screenPosition.x,
            screenPosition.y
          );
        } else {
          bodyDesc = rapier.RigidBodyDesc.fixed().setTranslation(
            screenPosition.x,
            screenPosition.y
          );
        }

        const initialrotationRad = toRad(initialRotation);
        bodyDesc.setRotation(initialrotationRad || 0);
        bodyDesc.setCanSleep(false);
        bodyDesc.setCcdEnabled(true);

        let collider = colliderFromElement(ref.current, rapier);

        collider.setRestitutionCombineRule(resitutionCombineRule);
        collider.setRestitution(restitution);
        collider.setFriction(friction);
        collider.setMass(mass);
        collider.setFrictionCombineRule(frictionCombineRule);

        if (bodyType === "fixed") {
          collider.setCollisionGroups(0x0001000f);
        } else {
          collider.setCollisionGroups(collisionGroups);
        }

        const rigidBody = world.createRigidBody(bodyDesc);
        world.createCollider(collider, rigidBody);

        const newBody: PhysicsBody = {
          motionValues: {
            x: motionValue(0),
            y: motionValue(0),
            rotateZ: motionValue(initialRotation),
          },

          ref: ref,
          rigidBody: rigidBody,
          originalPosition: {
            x: screenPosition.x,
            y: screenPosition.y,
            rotation: rigidBody.rotation(),
          },
        };

        bodies.set(newBody.rigidBody.handle, newBody);
        physicsBodyRef.current = bodies.get(newBody.rigidBody.handle)!;

        if (delay > 0 && bodyType === "dynamic") {
          setTimeout(() => {
            physicsBodyRef.current?.rigidBody?.setBodyType(
              rapier.RigidBodyType.Dynamic,
              true
            );
          }, delay);
        }

        setMotionValues({
          x: physicsBodyRef.current.motionValues.x,
          y: physicsBodyRef.current.motionValues.y,
          rotateZ: physicsBodyRef.current.motionValues.rotateZ,
        });
      }
    };

    useEffect(() => {
      if (intializeOnMount && !controlRef) {
        intializePhysicsBody();
      }
      return () => {
        if (physicsBodyRef.current) {
          world.removeRigidBody(physicsBodyRef.current.rigidBody);
          bodies.delete(physicsBodyRef.current.rigidBody.handle);
          physicsBodyRef.current = null;
        }
      };
    }, []);

    return (
      <Comp
        style={{
          ...motionValues,
          ...(props as any)?.style,
        }}
        {...props}
        ref={ref}
      >
        {typeof children === "function"
          ? children(
              () => {
                intializePhysicsBody();
              },
              () => {
                console.warn("onResize not implemented yet");
              }
            )
          : children}
      </Comp>
    );
  }
);
