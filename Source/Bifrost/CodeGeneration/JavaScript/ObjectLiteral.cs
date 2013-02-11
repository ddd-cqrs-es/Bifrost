﻿#region License
//
// Copyright (c) 2008-2012, DoLittle Studios AS and Komplett ASA
//
// Licensed under the Microsoft Permissive License (Ms-PL), Version 1.1 (the "License")
// With one exception :
//   Commercial libraries that is based partly or fully on Bifrost and is sold commercially, 
//   must obtain a commercial license.
//
// You may not use this file except in compliance with the License.
// You may obtain a copy of the license at 
//
//   http://bifrost.codeplex.com/license
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
#endregion

namespace Bifrost.CodeGeneration.JavaScript
{
    /// <summary>
    /// Represents an object literal
    /// </summary>
    public class ObjectLiteral : Container
    {
#pragma warning disable 1591
        public override void Write(ICodeWriter writer)
        {
            var childIndex = 0;
            var numberOfChildren = Children.Count;

            writer.Write("{{");

            if (numberOfChildren > 0)
            {
                writer.Newline();
                writer.Indent();

                foreach (var child in Children)
                {
                    child.Write(writer);
                    childIndex++;

                    if (childIndex > 0 && childIndex < numberOfChildren)
                        writer.Write(",");
                    writer.Newline();
                }

                writer.Unindent();
                writer.WriteWithIndentation("}}");
            }
            else
            {
                writer.Write("}}");
            }
        }
#pragma warning restore 1591
    }
}